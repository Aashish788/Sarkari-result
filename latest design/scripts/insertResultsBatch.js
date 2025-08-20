// Batch insert script for Supabase 'results' table
// Usage: node scripts/insertResultsBatch.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ardnhnxyvyebezfjwpgn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyZG5obnh5dnllYmV6Zmp3cGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzgzOTksImV4cCI6MjA2NzMxNDM5OX0.NowR2BzqfRAOtQ6gLNJ5lQIGNpy9ZOz1Zq1ayu40cos';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const results = [
  'Bihar Polytechnic PE 1st Round Final Seat Allotment Result 2025',
  'JCI Accountant Result 2025',
  'HPSC Assistant Professor Result 2025 – Out',
  'SSC Stenographer C, D Final Result 2025 – Out',
  'Railway SECR Bilaspur Apprentice Provisional Merit List 2025',
  'UPSC EPFO 2024 Shortlisted for Skill Test',
  'HSSC Group C (Group 25) Shortlisted Candidates 2nd List',
  'NFL Non Executives Various Post 2024 Result/ Score Card',
  'Central Bank Zone Based Officer ZBO Result 2025 – Out',
  'UPSSSC Auditor & Assistant Accountant 05/2023 Result – Out',
  'Delhi CSIR CRRI JSA, JST Skill Test Result 2025',
  'Bihar BTSC Dentist Result 2025 – Out',
  'India Post GDS 5th Merit List 2025 – Out',
  'AIC Management Trainee MT Result 2025 – Out',
  'IDBI Bank JAM Grade “O” Result 2025 – Out',
  'UP Board 10th / 12th Scrutiny Result 2025 – Out',
  'IDBI Bank JAM Final Result 2025 – Out',
  'Bihar Home Guard Final Merit List 2025 – Out',
  'BRABU UG 1st Merit List 2025-29 – Out',
  'UPPSC Staff Nurse Unani 2023 Final Result – Out',
  'UPPSC Staff Nurse Ayurved Final Result 2025 – Out',
  'Bihar CET B.Ed 1st College Allotment Result 2025 – Out',
  'NTA CUET UG Result 2025 – Out',
  'UP CPET Result 2025 – Out',
];

function pad(n) { return n < 10 ? '0' + n : '' + n; }

function formatPostTime(date, hour, minute) {
  // date: JS Date, hour: 1 or 9, minute: 0
  let h = hour;
  let ampm = h >= 12 ? 'PM' : 'AM';
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${h}:${pad(minute)} ${ampm}`;
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

async function ensureUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const { data, error } = await supabase
      .from('results')
      .select('id')
      .eq('slug', slug);
    if (error || !data || data.length === 0) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
    if (counter > 100) return `${baseSlug}-${Date.now()}`;
  }
}

async function main() {
  let date = new Date(2025, 6, 14); // July 14, 2025 (month is 0-indexed)
  let hourSlots = [13, 9]; // 1 PM, 9 AM
  let hourIdx = 0;

  let inserts = [];
  for (let i = 0; i < results.length; i++) {
    if (i > 0 && i % 2 === 0) {
      date.setDate(date.getDate() - 1);
    }
    const hour = hourSlots[hourIdx % 2];
    hourIdx++;
    const post_time = formatPostTime(date, hour, 0);
    const title = results[i];
    const baseSlug = slugify(title);
    // eslint-disable-next-line no-await-in-loop
    const slug = await ensureUniqueSlug(baseSlug);
    const status = title.toLowerCase().includes('out') ? 'Out' : 'Published';
    inserts.push({
      title,
      slug,
      post_time,
      status,
    });
  }

  // Insert in batches of 10
  for (let i = 0; i < inserts.length; i += 10) {
    const batch = inserts.slice(i, i + 10);
    // eslint-disable-next-line no-await-in-loop
    const { error } = await supabase.from('results').insert(batch);
    if (error) {
      console.error('Insert error:', error, batch);
    } else {
      console.log('Inserted batch:', batch.map(x => x.title));
    }
  }
}

main().then(() => process.exit(0)); 