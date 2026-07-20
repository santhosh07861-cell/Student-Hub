import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env file manually
try {
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const index = trimmed.indexOf('=');
      if (index !== -1) {
        const key = trimmed.substring(0, index).trim();
        const value = trimmed.substring(index + 1).trim();
        process.env[key] = value.replace(/^['"]|['"]$/g, '');
      }
    });
  }
} catch (e) {
  console.warn("Could not read .env file:", e.message);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const monthMap = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
  january: '01', february: '02', march: '03', april: '04', june: '06',
  july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
};

function parseExtractedDate(dateStr) {
  let match = dateStr.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
  if (match) {
    let day = match[1].padStart(2, '0');
    let month = match[2].padStart(2, '0');
    let year = match[3];
    return `${year}-${month}-${day}`;
  }
  
  match = dateStr.match(/(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/);
  if (match) {
    let year = match[1];
    let month = match[2].padStart(2, '0');
    let day = match[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  match = dateStr.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([a-zA-Z]+)\s+(\d{4})/i);
  if (match) {
    let day = match[1].padStart(2, '0');
    let monthName = match[2].toLowerCase();
    let month = monthMap[monthName];
    let year = match[3];
    if (month) return `${year}-${month}-${day}`;
  }

  match = dateStr.match(/([a-zA-Z]+)\s+(\d{1,2})(?:st|nd|rd|th)?\s*,\s*(\d{4})/i);
  if (match) {
    let monthName = match[1].toLowerCase();
    let day = match[2].padStart(2, '0');
    let month = monthMap[monthName];
    let year = match[3];
    if (month) return `${year}-${month}-${day}`;
  }
  
  return null;
}

const deadlineKeywords = [
  /last\s*date/i,
  /deadline/i,
  /closing\s*date/i,
  /apply\s*by/i,
  /end\s*date/i,
  /close\s*on/i
];

const dateRegex = /\b\d{1,2}[-/\.]\d{1,2}[-/\.]\d{4}\b|\b\d{4}[-/\.]\d{1,2}[-/\.]\d{1,2}\b|\b\d{1,2}(?:st|nd|rd|th)?\s+[a-zA-Z]+\s+\d{4}\b|\b[a-zA-Z]+\s+\d{1,2}(?:st|nd|rd|th)?\s*,\s*\d{4}\b/gi;

async function extractDeadlineFromUrl(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    clearTimeout(timeoutId);

    // If page returns 404, report it as a dead link
    if (res.status === 404) {
      return { is404: true };
    }

    if (!res.ok) return null;
    let html = await res.text();
    
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    const cleanText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');

    for (const kw of deadlineKeywords) {
      let index = cleanText.search(kw);
      if (index !== -1) {
        const start = Math.max(0, index - 50);
        const end = Math.min(cleanText.length, index + 100);
        const windowText = cleanText.slice(start, end);
        
        const matches = windowText.match(dateRegex);
        if (matches) {
          for (const match of matches) {
            const parsed = parseExtractedDate(match);
            if (parsed) {
              return { deadline: parsed };
            }
          }
        }
      }
    }
  } catch (err) {
    // If connection completely fails, treat it as possibly down/closed
    return { isFailed: true };
  }
  return null;
}

async function startScraper() {
  console.log("🚀 Starting Automatic Deadline & 404 Status Scraper...");
  
  // 1. Fetch Scholarships
  console.log("\n--- Checking Scholarships ---");
  const { data: scholarships, error: sErr } = await supabase
    .from('scholarship')
    .select('id, name, officialApplyLink, deadline, status');
    
  if (sErr) {
    console.error("Error fetching scholarships:", sErr);
  } else {
    for (const item of scholarships) {
      const link = item.officialApplyLink;
      if (!link) continue;

      console.log(`- Scraping ${item.name} (${link})...`);
      const result = await extractDeadlineFromUrl(link);

      if (result && result.is404) {
        console.log(`  ❌ Page returned 404 (Not Found)! Automatically setting status to Closed.`);
        await supabase
          .from('scholarship')
          .update({ status: 'Closed' })
          .eq('id', item.id);
      } else if (result && result.deadline) {
        console.log(`  🎉 Found deadline: ${result.deadline}`);
        await supabase
          .from('scholarship')
          .update({ deadline: result.deadline })
          .eq('id', item.id);
      } else {
        console.log("  ⚠️ No deadline date detected.");
      }
    }
  }

  // 2. Fetch Internships
  console.log("\n--- Checking Internships ---");
  const { data: internships, error: iErr } = await supabase
    .from('internship')
    .select('id, role, officialWebsite, officialApplyLink, deadline, status');
    
  if (iErr) {
    console.error("Error fetching internships:", iErr);
  } else {
    for (const item of internships) {
      const link = item.officialApplyLink || item.officialWebsite;
      if (!link) continue;

      console.log(`- Scraping ${item.role} (${link})...`);
      const result = await extractDeadlineFromUrl(link);

      if (result && result.is404) {
        console.log(`  ❌ Page returned 404 (Not Found)! Automatically setting status to Closed.`);
        await supabase
          .from('internship')
          .update({ status: 'Closed' })
          .eq('id', item.id);
      } else if (result && result.deadline) {
        console.log(`  🎉 Found deadline: ${result.deadline}`);
        await supabase
          .from('internship')
          .update({ deadline: result.deadline })
          .eq('id', item.id);
      } else {
        console.log("  ⚠️ No deadline date detected.");
      }
    }
  }

  console.log("\n✅ Scraper completed.");
}

startScraper();
