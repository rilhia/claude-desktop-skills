# Job Scan LinkedIn
 
SKILL.md follows this for its source row, with:
 
- the settings (job titles, work arrangement, role focus, CV, limits)
- the row's **location ID** and **posted in the last** period, plus its **seen file** and **results CSV**
Fill every `{{PLACEHOLDER}}` below from those settings before using it.
 
Work through the steps in order without stopping to deliberate. Use the built-in browser, which should already be signed in to LinkedIn, and wait the configured pause between page loads.
 
## 1. Collect job URLs for each job title
 
For each job title, open:
 
`https://www.linkedin.com/jobs/search-results/?keywords=%22{{JOB_TITLE}}%22&geoId={{GEO_ID}}&f_TPR=r{{POSTED_SECONDS}}&f_WT={{WORKPLACE_FILTER}}`
 
If LinkedIn shows a sign-in page, a checkpoint or a CAPTCHA, do not try to get past it. Stop and report `PROBLEM: LinkedIn needs you to sign in`.
 
Otherwise run this with the JavaScript tool. It scrolls the results until no more load, then returns just the full job URLs, stopping at LinkedIn's "may not be exact matches" divider:
 
```js
(async()=>{const S=m=>new Promise(r=>setTimeout(r,m)),D=/may not be exact matches/i,sel='[data-job-id],[data-occludable-job-id],a[href*="/jobs/view/"]';const f=document.querySelector(sel);if(!f)return'NO_CARDS';let p=f.parentElement;while(p&&p.scrollHeight<=p.clientHeight+5)p=p.parentElement;for(let i=0,l=-1;i<15;i++){const n=document.querySelectorAll(sel).length;if(n===l)break;l=n;p?p.scrollTop=p.scrollHeight:scrollTo(0,document.body.scrollHeight);await S(1200)}const ids=new Set();let div=false;const w=document.createTreeWalker(document.body,5);while(w.nextNode()){const n=w.currentNode;if(n.nodeType===3){if(D.test(n.textContent)){div=true;break}continue}const v=n.getAttribute('data-job-id')||n.getAttribute('data-occludable-job-id')||((n.getAttribute('href')||'').match(/\/jobs\/view\/(\d+)/)||[])[1]||([...n.attributes].map(a=>a.value).join(' ').match(/job-card-component-ref-(\d+)/)||[])[1];if(v&&/^\d+$/.test(v))ids.add(v)}return(div?'DIVIDER ':'')+ids.size+'\n'+[...ids].map(i=>'https://www.linkedin.com/jobs/view/'+i+'/').join('\n')})()
```
 
Keep a running list of URLs across all titles. If the result did not start with `DIVIDER` and there is a next page of results, click it and run the script again, up to the configured number of LinkedIn result pages per title. If it returns `NO_CARDS` on a page that clearly has jobs, read the page text instead and take the URLs from the /jobs/view/ links, in the form `https://www.linkedin.com/jobs/view/<number>/`.
 
## 2. Keep only the new jobs
 
`node <log script> new <seen file> <url> <url> ...`
 
It prints only the URLs not seen before, or `NONE`. Only those get opened.
 
## 3. Assess each new job
 
Open each new URL and read it with the page text tool. Rate it **Strong**, **Good** or **Weak** against the CV, using only what the CV actually shows:
 
- Is it the role focus from the settings, rather than a different job with a similar title?
- Does the seniority fit, and does the CV meet any hard requirements?
- Does it pass the work arrangement rules? Check the job page's own Remote, Hybrid or On-site tag and location, not the search card. A job that fails them is Weak however good the rest is.
Record every job straight after rating it, Weak ones included. The job number is the number in its URL:
 
`node <log script> record <seen file> <results CSV> "<job number>" "<title>" "<company>" "<url>" "<rating>" "<brief reason for the rating>"`
 
This adds the URL to the seen file and a row to the results CSV. Keep the reason to one short line. If a page will not load after one retry, record it with rating `Failed` and reason `Page would not load`, and count it as a problem, so it is not retried forever. Jobs not reached because of the limit are not recorded, so they come up again next run.
 
## 4. Return the result
 
```
SOURCE: LinkedIn
STATUS: OK or PROBLEM: <what went wrong>
COUNTS: found <unique URLs>, new <new URLs>, weak <n>, matches <n>
MATCH: <Strong|Good> | <title> | <company> | <url> | <one-line reason>
```
 
