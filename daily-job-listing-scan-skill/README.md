# Daily Job Listing Scan

A Claude skill that searches job boards for the roles you want, rates each new job against your CV and emails you a summary. Set it up once, schedule it, and each day you get one email listing the jobs worth looking at.

This guide takes you through downloading the skill, adding your own settings, installing it in Claude Desktop and scheduling it to run automatically.

## Contents

- [What it does](#what-it-does)
- [What's in this folder](#whats-in-this-folder)
- [Before you start](#before-you-start)
- [Which model to use](#which-model-to-use)
- [Two ways to set it up](#two-ways-to-set-it-up)
- [Setting it up by hand](#setting-it-up-by-hand)
- [Running it as a scheduled task](#running-it-as-a-scheduled-task)
- [The files it creates](#the-files-it-creates)
- [Changing your settings later](#changing-your-settings-later)
- [Troubleshooting](#troubleshooting)

## What it does

Each time it runs, the skill:

1. Searches each job source for the job titles you choose. The sources are company job boards on Ashby, Greenhouse and Lever (found through Google) and LinkedIn.
2. Skips any job it has already looked at on an earlier run.
3. Reads each new job and rates it **Strong**, **Good** or **Weak** against your CV, your role focus and the work arrangements you accept (remote, hybrid or on-site).
4. Logs every job it looked at, with its rating and a one-line reason, so you can check how well each run went.
5. Sends you one email with the best matches first.

Small pieces of JavaScript do the mechanical work, such as pulling links from pages and checking which jobs are new. That keeps each run quicker and uses fewer tokens.

## What's in this folder

```
daily-job-listing-scan/
  SKILL.md             the skill itself, including all your settings
  resources/ats.md     how to scan ATS job boards (Ashby, Greenhouse, Lever)
  resources/linkedin.md  how to scan LinkedIn
  scripts/joblog.js    keeps track of which jobs have been seen and logs the results
```

You only ever edit the **Settings** and **Sources** sections of `SKILL.md`. Leave everything else as it is.

## Before you start

You need:

- **Claude Desktop** on a paid plan (Pro, Max, Team or Enterprise). Scheduled tasks need a paid plan.
- **"Code execution and file creation" turned on.** Find it in Claude's Settings, under Capabilities. Skills don't work without it.
- **The Gmail connector.** The skill sends its results as an email at the end of every run, and it can only do that through Gmail. Without the connector, the scan still runs and logs its results, but no email is sent.
- **Claude's built-in browser signed in to LinkedIn**, if you want to scan LinkedIn. The skill uses the browser inside the Claude Desktop app, not your own web browser.
- **A folder for the scan's data**, for example `Documents/job-scan`. The skill keeps its logs here.
- **Your CV** as a .docx, .pdf or .txt file. Put it inside the data folder, so the skill only needs access to one folder.

## Which model to use

The skill runs well on **Sonnet 5 with effort set to Low**. Most of the work is fixed steps, so a higher setting mostly adds cost.

You can try a smaller model or a lower setting to save usage, but check the results closely for the first few runs. Look for jobs being missed, ratings that don't make sense, or `results.csv` files that aren't being updated.

## Two ways to set it up

**Option A: let Claude guide you.** Open [SETUP_PROMPT.md](SETUP_PROMPT.md), copy the prompt into a new task in Claude Desktop and answer Claude's questions. Claude downloads the files, fills in your settings, makes the zip file and tells you how to install and schedule it.

**Option B: do it yourself.** Follow the steps below. It takes about 15 minutes.

Either way, it's worth reading through the files on GitHub first so you know what you're installing.

## Setting it up by hand

### Step 1: Download the skill

1. Go to the repository's main page on GitHub.
2. Click the green **Code** button, then **Download ZIP**.
3. Unzip the download and open the `daily-job-listing-scan-skill` folder.
4. Copy the `daily-job-listing-scan` folder somewhere easy to find, such as your Desktop. This is the folder you'll edit and install.

If you use git, you can clone the repository instead.

### Step 2: Add your settings

Open `daily-job-listing-scan/SKILL.md` in a plain text editor, such as TextEdit (set to plain text), Notepad or VS Code. Don't use a word processor, because it can change the formatting.

Find the **Settings** section and change the values after each colon.

**What to look for**

| Setting | What it means | Example |
|---|---|---|
| Job titles to search for | The job titles to search each source for. Each title is one search, so more titles means longer runs. Keep each title in quotes. | `"developer advocate", "developer relations"` |
| Also match titles containing | Extra words that also count as a matching title, without running a separate search for them. They catch variations such as "DevRel Engineer". | `"devrel", "developer evangelist"` |
| Role focus | One or two sentences on the kind of role you want and the look-alike roles to reject. This is what stops a sales job with a similar title from being rated well. | `Genuine developer relations work aimed at external developers. Not sales or support roles with a similar title.` |

**Where you can work**

| Setting | What it means | Example |
|---|---|---|
| Home country | Where you live | `United Kingdom` |
| Remote | Where you'll accept remote jobs | `accept from anywhere, unless the job is limited to countries that exclude the home country` |
| Hybrid | Where you'll accept hybrid jobs | `accept in the home country only` |
| On-site | Where you'll accept on-site jobs | `never accept` |

Jobs that don't fit these rules are rated Weak, however good a match they are otherwise.

**Your files and email**

| Setting | What it means | Example |
|---|---|---|
| Data folder | The full path to the folder where the skill keeps its logs | `/Users/yourname/Documents/job-scan` |
| CV | The full path to your CV | `/Users/yourname/Documents/job-scan/MyCV.docx` |
| Email results to | Where to send the summary email | `you@example.com` |

On a Mac, you can get a file's full path by selecting it in Finder, then pressing Option + Command + C.

**Limits**

| Setting | What it means | Suggested |
|---|---|---|
| Most jobs to assess per source per run | A cap on how many jobs are read each run. Any not reached are picked up next time. | 40 |
| Pause between page loads | A short wait between pages, so the sites aren't hit too quickly | 2 seconds |
| Google result pages per job title | How many pages of Google results to check for each title | 3 |
| LinkedIn result pages per job title | How many pages of LinkedIn results to check for each title | 5 |

Next, find the **Sources** table. Each row is one job source.

- **To turn a source off**, delete its row.
- **To add another job board** that works like Ashby, Greenhouse or Lever, copy one of those rows and change the board address.
- **For LinkedIn**, set two things:
  - **Location ID:** LinkedIn's number for your country. To find it, search for jobs on LinkedIn, choose your country as the location, then copy the number after `geoId=` in the address bar. The United Kingdom is 101165590.
  - **Posted in the last:** how far back to look, for example `24 hours` or `1 week`.

Save the file. Don't change anything below the Sources table.

### Step 3: Make the zip file

The zip must contain the `daily-job-listing-scan` folder itself, not just the files inside it.

- **Mac:** right-click the `daily-job-listing-scan` folder and choose **Compress "daily-job-listing-scan"**.
- **Windows:** right-click the folder, then choose **Send to**, then **Compressed (zipped) folder**. On Windows 11 you may need **Show more options** first.

You should now have `daily-job-listing-scan.zip`. When opened, it should show one folder called `daily-job-listing-scan`, with `SKILL.md`, `resources` and `scripts` inside.

### Step 4: Install the skill in Claude Desktop

1. In Claude Desktop, check that **Code execution and file creation** is on, in Settings under Capabilities.
2. Go to **Customize**, then **Skills**.
3. Click the **+** button, then **Create skill**, then **Upload a skill**.
4. Choose your `daily-job-listing-scan.zip`.
5. Check that the skill is switched on in the list.

If you already have a skill called `daily-job-listing-scan`, change the `name:` line at the very top of `SKILL.md` to something else, then zip and upload again.

### Step 5: Connect Gmail and LinkedIn

1. **Gmail:** add the Gmail connector from Claude's connectors and sign in with the account that should send the email. This is needed for the results email at the end of each run.
2. **LinkedIn:** open Claude's built-in browser, go to linkedin.com and sign in. The skill won't try to sign in for you. If LinkedIn asks you to sign in again later, the email will tell you.

### Step 6: Run it once as a test

1. Start a new task in Claude Desktop and connect your data folder to it.
2. Type: **Run the Daily Job Listing Scan**
3. Let it finish. The first run usually takes longest, because every job is new.

Then check:

- You received the summary email.
- Your data folder now has a subfolder for each source (for example `ashby` and `linkedin`), each containing `seen.txt` and `results.csv`.
- The ratings and reasons in `results.csv` make sense for your CV.

If something looks wrong, see [Troubleshooting](#troubleshooting).

## Running it as a scheduled task

Once the test run works, schedule it so it runs every day on its own.

1. In Claude Desktop, click **Scheduled** in the left sidebar.
2. Click **New task**, then **Set up manually**.
3. Fill in:
   - **Task name:** Daily Job Listing Scan
   - **Prompt:** Run the Daily Job Listing Scan skill.
   - **Frequency:** Daily (or Weekdays)
   - **Model:** Sonnet 5, with effort set to Low
   - **Working folder:** your data folder
4. Save it.
5. Click **Run now** once to check it works as a scheduled task.

**Important: it must run on your computer.** Scheduled tasks normally run in the cloud, even when your computer is asleep, and a cloud run can't reach folders on your computer. This skill needs your data folder, your CV and the built-in browser signed in to LinkedIn. That means:

- If your task settings offer **Require this computer**, turn it on.
- Your computer must be on, and Claude Desktop open, at the scheduled time.

**Approvals.** A scheduled run has nobody watching it, so a step waiting for your approval will stall. If your task settings offer automatic approval, consider turning it on for this task.

From the Scheduled section you can pause, resume, edit or delete the task at any time.

## The files it creates

Inside your data folder, each source gets its own subfolder:

```
job-scan/
  ashby/
    seen.txt
    results.csv
  greenhouse/
  lever/
  linkedin/
```

- **seen.txt** lists the full web address of every job already looked at, so no job is assessed twice.
- **results.csv** lists every job looked at, Weak ones included. It opens in Excel, Numbers or Google Sheets. The columns are:

| Column | Contents |
|---|---|
| ID | The job's number on that site |
| Job Name | The job title |
| Company | The employer |
| URL | The link to the job |
| Rating | Strong, Good or Weak. Also Gone (the job had been taken down) or Failed (the page wouldn't load) |
| Reason | A one-line reason for the rating |
| First Seen | The date the scan first found the job |

To make the scan look at every job again from scratch, delete that source's `seen.txt`.

## Changing your settings later

1. Edit `SKILL.md` in your `daily-job-listing-scan` folder.
2. Zip the folder again, as in Step 3.
3. In **Customize**, then **Skills**, remove the old version and upload the new zip.

Your scheduled task and data files carry on as before.

## Troubleshooting

| What you see | What to do |
|---|---|
| No email arrives | Check the Gmail connector is connected. The scan's other results are still saved in each `results.csv`. |
| "No folder access" | Connect your data folder to the task, or set it as the scheduled task's working folder. |
| "CV not found at the path" | Check the CV path in Settings. The full path must match exactly, including capital letters. |
| "LinkedIn needs you to sign in" | Sign in to LinkedIn again in Claude's built-in browser. |
| "Google showed a CAPTCHA" | Google has paused automated searches for a while. The other sources still run. Try again later, or reduce the Google result pages setting. |
| The job cap was reached | Normal on a first run. The rest are picked up on the next run. |
| A LinkedIn search finds nothing when there clearly are jobs | LinkedIn may have changed its page layout. The skill falls back to reading the page, and says so in the email. |
| The scheduled task doesn't run or can't find files | Check it's set to run on your computer, that the computer was on with Claude open, and that the data folder is its working folder. |
| Ratings look wrong | Tighten the Role focus setting, or try a more capable model. |

## Further help

- [Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
- [How to create custom skills](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- [Schedule recurring tasks](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork)

Menu names in Claude Desktop can change between versions. If a step doesn't match what you see, check the links above for the current steps.
