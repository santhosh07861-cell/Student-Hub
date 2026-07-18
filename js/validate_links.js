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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: Supabase environment variables are missing.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if a URL is active
async function checkUrlStatus(url) {
  if (!url) return 'Closed';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    // If the website explicitly returns 404, it means the page/internship is not found (Closed)
    if (response.status === 404) {
      return 'Closed';
    }
    
    return 'Open';
  } catch (error) {
    // If the request fails completely (DNS error, etc.), we mark it as closed
    if (error.name === 'AbortError') {
      console.log(`Timeout checking: ${url}`);
      return 'Open'; // Keep open on timeout to avoid false negatives
    }
    return 'Closed';
  }
}

async function validateInternships() {
  console.log("Fetching all internships from database...");
  const { data: internships, error } = await supabase
    .from('internship')
    .select('id, role, companyName, officialWebsite, officialApplyLink, status');

  if (error) {
    console.error("Database fetch error:", error.message);
    return;
  }

  console.log(`Checking links for ${internships.length} internships...`);
  
  for (const item of internships) {
    const targetUrl = item.officialWebsite || item.officialApplyLink;
    const currentStatus = item.status;
    
    const newStatus = await checkUrlStatus(targetUrl);
    
    if (newStatus !== currentStatus) {
      console.log(`[Status Change] ${item.companyName} - ${item.role}: ${currentStatus} ➔ ${newStatus} (${targetUrl})`);
      
      const { error: updateError } = await supabase
        .from('internship')
        .update({ status: newStatus })
        .eq('id', item.id);
        
      if (updateError) {
        console.error(`Failed to update status for ${item.id}:`, updateError.message);
      }
    }
  }
  console.log("Internship link validation complete!");
}

(async () => {
  await validateInternships();
})();
