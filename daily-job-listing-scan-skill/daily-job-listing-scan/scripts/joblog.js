#!/usr/bin/env node
// joblog.js - checks and updates the job scan log files so the model never has to read them.
//
//   node joblog.js new    <seen_file> <url> [<url> ...]
//       Prints only the URLs not already in the seen file, or NONE.
//
//   node joblog.js record <seen_file> <results_csv> <id> <title> <company> <url> <rating> <reason>
//       Adds the URL to the seen file and a row to the results CSV (every assessed job, Weak included).
//       Rating is Strong, Good or Weak, or Gone / Failed for a job that could not be rated.
//
// Jobs are keyed by full URL, so two sites using the same job number never clash. URLs are tidied
// before comparing (tracking parameters such as utm_* and gh_src, #fragments and trailing slashes
// removed), so the same job always gives the same key. Files are created if missing.
 
const fs = require('fs');
const path = require('path');
 
const HEADER = ['ID', 'Job Name', 'Company', 'URL', 'Rating', 'Reason', 'First Seen'];
const TRACKING = /^(utm_\w+|gh_src|source|src|ref|referrer|lever-source|lever-origin|trk|trackingId|refId|fbclid|gclid)$/i;
 
function tidy(raw) {
  try {
    const u = new URL(raw.trim());
    for (const k of [...u.searchParams.keys()]) if (TRACKING.test(k)) u.searchParams.delete(k);
    u.hash = '';
    let s = u.origin.toLowerCase() + u.pathname.replace(/\/+$/, '') + u.search;
    return s;
  } catch (e) {
    return raw.trim();
  }
}
 
function readLines(f) {
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(l => l.trim()) : [];
}
 
function ensureDir(f) {
  fs.mkdirSync(path.dirname(f), { recursive: true });
}
 
// Minimal CSV handling (quoted fields, commas and quotes inside fields).
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(v => v !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); if (row.some(v => v !== '')) rows.push(row); }
  return rows;
}
const csvLine = vals => vals.map(v => (/[",\r\n]/.test(v) ? '"' + String(v).replace(/"/g, '""') + '"' : v)).join(',') + '\n';
 
// Load the results CSV, upgrading an older file (without Rating and Reason) to the current columns.
function loadResults(f) {
  ensureDir(f);
  if (!fs.existsSync(f)) { fs.writeFileSync(f, csvLine(HEADER)); return []; }
  const rows = parseCsv(fs.readFileSync(f, 'utf8'));
  if (!rows.length) { fs.writeFileSync(f, csvLine(HEADER)); return []; }
  const head = rows[0].map(h => h.trim());
  if (head.join(',') === HEADER.join(',')) return rows.slice(1);
  const idx = name => head.findIndex(h => h.toLowerCase() === name.toLowerCase());
  const upgraded = rows.slice(1).map(r => HEADER.map(h => (idx(h) >= 0 ? r[idx(h)] || '' : '')));
  fs.writeFileSync(f, csvLine(HEADER) + upgraded.map(csvLine).join(''));
  return upgraded;
}
 
// Older seen files held bare job IDs. Treat those as matching a URL that ends with that ID.
function isSeen(url, seenSet, legacyIds) {
  if (seenSet.has(url)) return true;
  const last = url.split('?')[0].split('/').pop();
  return legacyIds.has(last);
}
 
const [cmd, ...args] = process.argv.slice(2);
 
if (cmd === 'new') {
  const [seenFile, ...urls] = args;
  const lines = readLines(seenFile).map(l => l.trim());
  const seenSet = new Set(lines.filter(l => l.includes('://')).map(tidy));
  const legacyIds = new Set(lines.filter(l => !l.includes('://')));
  const fresh = [...new Set(urls.map(tidy))].filter(u => !isSeen(u, seenSet, legacyIds));
  console.log(fresh.length ? fresh.join('\n') : 'NONE');
} else if (cmd === 'record') {
  const [seenFile, csvFile, id, title, company, rawUrl, rating, reason] = args;
  if (!rawUrl || !rating) {
    console.log('usage: node joblog.js record <seen_file> <results_csv> <id> <title> <company> <url> <rating> <reason>');
    process.exit(1);
  }
  const url = tidy(rawUrl);
  ensureDir(seenFile);
  const seenLines = readLines(seenFile).map(l => l.trim());
  if (!seenLines.some(l => l.includes('://') && tidy(l) === url)) fs.appendFileSync(seenFile, url + '\n');
  const rows = loadResults(csvFile);
  if (rows.some(r => tidy(r[3] || '') === url)) return console.log('already recorded');
  const today = new Date().toISOString().slice(0, 10);
  fs.appendFileSync(csvFile, csvLine([id || '', title || '', company || '', url, rating, reason || '', today]));
  console.log('recorded');
} else {
  console.log('usage: node joblog.js new <seen_file> <url> ...  |  record <seen_file> <results_csv> <id> <title> <company> <url> <rating> <reason>');
  process.exit(1);
}
 
