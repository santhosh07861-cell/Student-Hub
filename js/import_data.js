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
        process.env[key] = value.replace(/^['"]|['"]$/g, ''); // strip optional quotes
      }
    });
  }
} catch (e) {
  console.warn("Could not read .env file:", e.message);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined in your .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function importInternships() {
  console.log("Reading all internship JSON files...");
  try {
    const govPath = path.resolve('public/data/government-internships.json');
    const pvtPath = path.resolve('public/data/private-internships.json');
    const genericPath = path.resolve('public/data/internships.json');

    const govData = fs.existsSync(govPath) ? JSON.parse(fs.readFileSync(govPath, 'utf-8')) : [];
    const pvtData = fs.existsSync(pvtPath) ? JSON.parse(fs.readFileSync(pvtPath, 'utf-8')) : [];
    const genericData = fs.existsSync(genericPath) ? JSON.parse(fs.readFileSync(genericPath, 'utf-8')) : [];

    const allInternships = [];

    // 1. Process Government Internships
    govData.forEach(item => {
      allInternships.push({
        role: item.internshipName || item.role || '',
        companyName: item.organization || item.companyName || item.org || '',
        companyLogo: item.logo || '',
        logo: item.logo || '',
        mode: item.mode || 'On-site',
        location: item.location || '',
        duration: item.duration || '',
        skills: item.requiredSkills || [],
        officialApplyLink: item.officialApplicationPage || item.officialApplyLink || item.applyLink || '',
        officialWebsite: item.officialWebsite || item.officialInternshipPage || '',
        whoCanApply: item.whoCanApply || '',
        eligibility: item.eligibility || '',
        stipend: item.stipend || '',
        paidStatus: item.paidStatus || '',
        status: item.status || 'Open',
        requiredDocuments: item.requiredDocuments || [],
        engineeringBranch: item.engineeringBranch || '',
        isGovernment: true
      });
    });

    // 2. Process Private Internships
    pvtData.forEach(item => {
      allInternships.push({
        role: item.internshipName || item.role || '',
        companyName: item.organization || item.companyName || '',
        companyLogo: item.logo || item.companyLogo || '',
        logo: item.logo || item.companyLogo || '',
        mode: item.mode || 'Remote',
        location: item.location || '',
        duration: item.duration || '',
        skills: item.requiredSkills || item.skills || [],
        officialApplyLink: item.officialApplicationPage || item.officialApplyLink || item.applyLink || '',
        officialWebsite: item.officialInternshipPage || item.officialWebsite || '',
        whoCanApply: item.whoCanApply || '',
        eligibility: item.eligibility || '',
        stipend: item.stipend || '',
        paidStatus: item.paidStatus || (item.stipend ? (item.stipend.toLowerCase().includes('unpaid') ? 'Unpaid' : 'Paid') : 'Paid'),
        status: item.status || 'Open',
        requiredDocuments: item.requiredDocuments || [],
        engineeringBranch: item.engineeringBranch || '',
        isGovernment: false
      });
    });


    // 3. Process Generic Internships (if any new links)
    genericData.forEach(item => {
      allInternships.push({
        role: item.role || '',
        companyName: item.companyName || '',
        companyLogo: item.companyLogo || '',
        logo: item.companyLogo || '',
        mode: item.mode || '',
        location: item.location || '',
        duration: item.duration || '',
        skills: item.skills || [],
        officialApplyLink: item.officialApplyLink || '',
        officialWebsite: item.officialWebsite || '',
        isGovernment: false
      });
    });

    // Filter out duplicates based on officialApplyLink
    const uniqueInternships = [];
    const seenLinks = new Set();
    allInternships.forEach(item => {
      if (item.officialApplyLink && !seenLinks.has(item.officialApplyLink)) {
        seenLinks.add(item.officialApplyLink);
        uniqueInternships.push(item);
      }
    });

    console.log(`Upserting ${uniqueInternships.length} unique internships into Supabase...`);
    const { error } = await supabase
      .from('internship')
      .upsert(uniqueInternships, { onConflict: 'officialApplyLink' });

    if (error) {
      console.error("Failed to insert internships:", error.message);
    } else {
      console.log("Successfully imported all internships into Supabase!");
    }
  } catch (err) {
    console.error("Error reading/importing internships:", err.message);
  }
}

async function importScholarships() {
  console.log("Reading all scholarship JSON files...");
  try {
    const govPath = path.resolve('public/data/government-scholarships.json');
    const pvtPath = path.resolve('public/data/private-scholarships.json');
    const genericPath = path.resolve('public/data/scholarships.json');

    const govData = fs.existsSync(govPath) ? JSON.parse(fs.readFileSync(govPath, 'utf-8')) : [];
    const pvtData = fs.existsSync(pvtPath) ? JSON.parse(fs.readFileSync(pvtPath, 'utf-8')) : [];
    const genericData = fs.existsSync(genericPath) ? JSON.parse(fs.readFileSync(genericPath, 'utf-8')) : [];

    const allScholarships = [];

    // 1. Process Government Scholarships
    govData.forEach(item => {
      allScholarships.push({
        name: item.scholarshipName || item.name || '',
        organization: item.provider || item.organization || '',
        organizationLogo: item.logo || '',
        logo: item.logo || '',
        eligibility: item.eligibility || '',
        category: item.category || '',
        country: item.country || 'India',
        amount: item.amount || '',
        officialApplyLink: item.applyLink || item.officialApplyLink || '',
        officialWebsite: item.officialWebsite || '',
        whoCanApply: item.whoCanApply || '',
        educationLevel: item.educationLevel || '',
        incomeCriteria: item.incomeCriteria || '',
        state: item.state || '',
        benefits: item.benefits || '',
        requiredDocuments: item.requiredDocuments || [],
        isGovernment: true
      });
    });

    // 2. Process Private Scholarships
    pvtData.forEach(item => {
      allScholarships.push({
        name: item.name || '',
        organization: item.organization || '',
        organizationLogo: item.logo || item.organizationLogo || '',
        logo: item.logo || item.organizationLogo || '',
        eligibility: item.eligibility || '',
        category: item.category || '',
        country: item.country || 'India',
        amount: item.amount || '',
        officialApplyLink: item.officialApplicationPage || item.officialApplyLink || '',
        officialWebsite: item.officialScholarshipPage || item.officialWebsite || '',
        whoCanApply: item.whoCanApply || '',
        educationLevel: item.educationLevel || '',
        incomeCriteria: item.incomeCriteria || '',
        state: item.state || '',
        benefits: item.benefits || '',
        requiredDocuments: item.documents || [],
        isGovernment: false
      });
    });

    // 3. Process Generic Scholarships
    genericData.forEach(item => {
      allScholarships.push({
        name: item.name || '',
        organization: item.organization || '',
        organizationLogo: item.organizationLogo || '',
        logo: item.organizationLogo || '',
        eligibility: item.eligibility || '',
        category: item.category || '',
        country: item.country || '',
        amount: item.amount || '',
        officialApplyLink: item.officialApplyLink || '',
        officialWebsite: item.officialWebsite || '',
        isGovernment: false
      });
    });

    // Filter out duplicates
    const uniqueScholarships = [];
    const seenLinks = new Set();
    allScholarships.forEach(item => {
      if (item.officialApplyLink && !seenLinks.has(item.officialApplyLink)) {
        seenLinks.add(item.officialApplyLink);
        uniqueScholarships.push(item);
      }
    });

    console.log(`Upserting ${uniqueScholarships.length} unique scholarships into Supabase...`);
    const { error } = await supabase
      .from('scholarship')
      .upsert(uniqueScholarships, { onConflict: 'officialApplyLink' });

    if (error) {
      console.error("Failed to insert scholarships:", error.message);
    } else {
      console.log("Successfully imported all scholarships into Supabase!");
    }
  } catch (err) {
    console.error("Error reading/importing scholarships:", err.message);
  }
}

(async () => {
  await importInternships();
  await importScholarships();
})();
