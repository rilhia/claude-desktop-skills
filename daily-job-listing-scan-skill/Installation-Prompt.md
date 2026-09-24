# Set up the Daily Job Listing Scan with Claude
 
Copy everything in the box below into a new task in Claude Desktop. Claude will download the skill, ask you for your settings, package it and explain how to install and schedule it.
 
## What you need
 
- **Claude Desktop** on a paid plan, with "Code execution and file creation" turned on
- **The Gmail connector.** The scan sends its results as an email at the end of every run, and it can only do that through Gmail. Without it, the scan still runs and logs its results, but no email is sent.
- **Claude's built-in browser signed in to LinkedIn**, if you keep the LinkedIn source
- **A folder for the scan's data.** Connect it before you start, and put your CV in it too, so it is the only folder the scan needs.
## Which model to use
 
The scan runs well on **Sonnet 5 with effort set to Low**. You can try a smaller model or lower setting to save usage, but check the results closely for the first few runs: look for jobs being missed, ratings that don't make sense, or files that aren't updated.
 
```
I'd like to set up the Daily Job Listing Scan skill for my own job search. Please guide me through it one step at a time and wait for my answers where needed.
 
1. GET THE FILES
Download these four files into a working folder called daily-job-listing-scan, keeping the same subfolders:
 
- SKILL.md
- resources/ats.md
- resources/linkedin.md
- scripts/joblog.js
 
Each one is at:
https://raw.githubusercontent.com/rilhia/claude-desktop-skills/main/daily-job-listing-scan-skill/daily-job-listing-scan/<file>
 
Download them with a command such as curl, so they arrive exactly as published. Do not retype them or copy them from a summarised web page, because the scripts inside them must stay exactly as written. If downloading is blocked, stop and ask me to download the repository from GitHub (Code, then Download ZIP) and give you the daily-job-listing-scan folder from it.
 
Then read SKILL.md and tell me in a few sentences what the skill does and what it needs from me: a CV file, a folder on my computer for its data, the Gmail connector (the results email at the end of each run can only be sent through Gmail), and Claude's built-in browser signed in to LinkedIn if I keep the LinkedIn source. Check whether Gmail is connected, and if it isn't, tell me how to connect it.
 
2. ASK ME FOR MY SETTINGS
Only change the Settings and Sources sections of SKILL.md. Ask me a few questions at a time. Show the current value as the default and let me keep it.
 
- Job titles to search for, and any extra words that should also count as a title match
- Role focus: one sentence on the kind of role I want and the look-alike roles to reject. Offer to draft it from my job titles.
- My home country, and where I accept remote, hybrid and on-site work
- The data folder, the path to my CV (.docx, .pdf or .txt) and the email address for results. Suggest keeping the CV inside the data folder.
- The limits. Explain each in one line and suggest keeping the defaults.
- Which sources to keep. For LinkedIn I need the location ID for my country and how far back to look. If you don't know the ID for certain, tell me how to find it: search for jobs on LinkedIn in my country and copy the number after geoId= in the address bar. Offer to add other job boards as extra rows using resources/ats.md.
 
If my folders are connected, check that the CV exists and that the data folder can be created.
 
3. CHECK WITH ME
Show me the finished Settings and Sources sections and ask me to confirm. Do not change anything else in SKILL.md or the other files. Keep the skill name in the header as daily-job-listing-scan, unless I already have a skill with that name, in which case ask me for a new one.
 
4. PACKAGE IT
Create daily-job-listing-scan.zip with the daily-job-listing-scan folder at the top level of the zip (SKILL.md, resources and scripts inside that folder, not loose). Save it to my Downloads folder, or give it to me as a file if you can't reach that folder.
 
5. TELL ME HOW TO INSTALL, TEST AND SCHEDULE IT
Give me short numbered steps for:
 
- Turning on "Code execution and file creation" in Settings, under Capabilities
- Uploading the zip: Customize, then Skills, then the + button, then Create skill, then Upload a skill. Then check the skill is switched on.
- Connecting the Gmail connector. Make clear it is needed for the results email at the end of each run, and that without it no email is sent.
- Signing in to LinkedIn in Claude's built-in browser. Explain that it is separate from my normal web browser, that I open it with Cmd+Shift+B on a Mac or Ctrl+Shift+B on Windows (or the globe icon in the side panel), go to linkedin.com and sign in myself, and that the sign-in is remembered for later runs.
- Running it once as a test, with my data folder connected, by asking Claude to "Run the Daily Job Listing Scan". Tell me what to check afterwards: the summary email, and the results.csv file for each source.
- Scheduling it daily: Scheduled in the sidebar, then New task, then Set up manually. The prompt is "Run the Daily Job Listing Scan skill." For the model, choose Sonnet 5 with effort set to Low, which runs this skill well. A smaller model or lower setting may work but needs its results checked closely for the first few runs. The skill needs my data folder and the built-in browser on my computer, so the task must run on my computer, not in the cloud. Tell me to choose the data folder as the working folder and turn on "Require this computer" if the app offers them, and that my computer must be on with Claude open at the scheduled time.
 
If any menu names look different in my version of the app, check the Claude Help Center and give me the current steps.
```
 
