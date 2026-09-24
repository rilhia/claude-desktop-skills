# Job Scan ATS
 
Scans one job board platform, such as jobs.ashbyhq.com or job-boards.greenhouse.io. SKILL.md follows this once per platform row, with:
 
- the settings (job titles, title list, work arrangement, role focus, CV, limits)
- the row's **board**, plus its **seen file** and **results CSV**
Fill every `{{PLACEHOLDER}}` below from those settings before using it.
 
Work through the steps in order without stopping to deliberate. Use the built-in browser and wait the configured pause between page loads. Opening boards and job pages together counts towards the "most jobs to assess" limit.
 
## 1. Search Google for each job title
 
For each job title, open:
 
`https://www.google.com/search?q=site%3A{{BOARD_DOMAIN}}+%22{{JOB_TITLE}}%22+{{GOOGLE_EXTRA_WORDS}}`
 
Then run this with the JavaScript tool. It returns the company boards and job links (job number and full URL) on the results page, and nothing else:
 
```js
(()=>{const D='{{BOARD_DOMAIN}}';if(location.pathname.startsWith('/sorry')||document.querySelector('#captcha-form'))return'BLOCKED';const b=new Set(),j=new Map();for(const a of document.querySelectorAll('a[href]')){let u;try{u=new URL(a.href);if(u.pathname==='/url')u=new URL(u.searchParams.get('q')||u.searchParams.get('url'))}catch(e){continue}if(u.hostname!==D)continue;const p=u.pathname.split('/').filter(Boolean),id=(u.pathname.match(/\/([0-9a-f-]{36}|\d{5,})\/?$/)||[])[1];if(id)j.set(id,u.origin+u.pathname);else if(p.length===1)b.add(u.origin+'/'+p[0])}return'BOARDS:\n'+[...b].join('\n')+'\nJOBS:\n'+[...j].map(([i,u])=>i+' '+u).join('\n')})()
```
 
If it returns `BLOCKED`, Google wants a CAPTCHA. Stop searching and report `PROBLEM: Google showed a CAPTCHA`. Otherwise keep a running list of boards and jobs across all the titles, without duplicates. Look at up to the configured number of Google result pages per title by adding `&start=10`, `&start=20` and so on, and stop early when a page adds nothing new.
 
## 2. Open each company board
 
Open each board once and run this:
 
```js
(()=>{const K=new RegExp({{TITLE_LIST}}.map(t=>t.trim().split(/\s+/).map(w=>w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('\\b.{0,25}\\b')).join('|'),'i');const j=new Map();for(const a of document.querySelectorAll('a[href]')){const id=(a.pathname.match(/\/([0-9a-f-]{36}|\d{5,})\/?$/)||[])[1],t=(a.innerText||a.textContent).trim().split('\n')[0];if(id&&K.test(t))j.set(id,t+' | '+a.origin+a.pathname)}return[...j].map(([i,v])=>i+' | '+v).join('\n')||'NONE'})()
```
 
It returns job number, title and full URL for each matching job. Add them to the list.
 
## 3. Keep only the new jobs
 
Pass every job URL from the list to the log script:
 
`node <log script> new <seen file> <url> <url> ...`
 
It prints only the URLs not seen before, or `NONE`. Only those get opened.
 
## 4. Assess each new job
 
Open the job page and read it with the page text tool. If the page no longer shows that job (a 404, or it lands on the company board instead), the job has gone. Record it with rating `Gone` and reason `No longer listed` (see below), count it as gone, and move on.
 
Otherwise rate it **Strong**, **Good** or **Weak** against the CV, using only what the CV actually shows:
 
- Is it the role focus from the settings, rather than a different job with a similar title?
- Does the seniority fit, and does the CV meet any hard requirements?
- Does it pass the work arrangement rules? Check the location on the job page itself. A job that fails them is Weak however good the rest is.
Record every job straight after rating it, Weak ones included:
 
`node <log script> record <seen file> <results CSV> "<job number>" "<title>" "<company>" "<url>" "<rating>" "<brief reason for the rating>"`
 
This adds the URL to the seen file and a row to the results CSV. Keep the reason to one short line. Jobs not reached because of the limit are not recorded, so they come up again next run.
 
## 5. Return the result
 
```
SOURCE: <Ashby, Greenhouse or other name>
STATUS: OK or PROBLEM: <what went wrong>
COUNTS: found <jobs in the list>, new <new URLs>, weak <n>, matches <n>
MATCH: <Strong|Good> | <title> | <company> | <url> | <one-line reason>
```
 
Mention in STATUS if the limit cut the run short, or how many links had gone.
 
