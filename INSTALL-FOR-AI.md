# Gildsite installer: instructions for the AI on this server

You are an AI assistant (Claude Code, Codex or similar) running on a server.
A person asked you to install Gildsite here. They are **not a programmer**.
Your job: guide them through a short chat, ask for consent once, then let the
`gildsite-install` script do the work. You talk; the script changes the server.

## Golden rules

1. **Speak the person's language**, in short, plain sentences. No jargon. One question at a time.
2. **Nothing changes before consent.** Run only read-only commands (`check`, `plan`, `status`) until the person says yes to the plan. Then record it with `consent yes`.
3. **Never print secrets.** Passwords, tokens and keys stay in files the script writes (mode 600). Never echo them into the chat, never ask the person to paste a token into the chat.
4. **Only the script changes the server.** Do not install, delete or reconfigure anything by hand. If a step fails, show the person the one-line reason from the script and the fix it suggests.
5. **Do not touch other services** already running on this server. If `check` reports a conflict (busy port 80/443, low memory), stop and explain the choice in one sentence.
6. **Show progress.** After each step say: "Step N of 8 done: <what now works>."

## The conversation, step by step

### Step 0. Look around (read-only)

```sh
./gildsite-install check
```

Tell the person in one or two sentences whether the server is ready. If it is not
(for example too little memory), say what is missing and stop.

### Step 1. Ask three questions

Ask one at a time and save each answer:

| Ask | Save with |
|---|---|
| "What address should the website have? For example `www.yourcompany.com`." | `./gildsite-install answer DOMAIN <address>` |
| "What e-mail should the owner account use?" | `./gildsite-install answer OWNER_EMAIL <email>` |
| "What is the company name?" | `./gildsite-install answer COMPANY "<name>"` |

The panel lives on the same address under `/admin` (for example `www.yourcompany.com/admin`).

If `check` said port 80 or 443 is already used (nginx or Apache runs here), ask: "This server already has a web
server. Shall I keep it and give you a ready config file for it?" After a yes: `./gildsite-install answer WEB_SERVER existing`.
The installer then writes `/srv/gildsite/nginx-<name>.conf` and does not touch nginx; hand that file to whoever runs the server.

### Step 2. Show the plan and ask for consent

```sh
./gildsite-install plan
```

Retell the plan in plain words (5 lines at most) and ask: **"May I do this on your server?"**
Only after a clear yes:

```sh
./gildsite-install consent yes
```

### Step 3. DNS

```sh
./gildsite-install dns
```

It prints the record to add at the domain provider (one A record; the address without www is optional). Tell the person exactly where to
click (their provider's DNS settings) and what to type. Then wait: run `./gildsite-install dns`
again every minute or two until it says the address points to this server.

### Step 4. Install

```sh
./gildsite-install run
```

If it stops with "No access to the Gildsite code yet", ask the person for the **download key**
they received with Gildsite. It is read-only and only for downloading. Save it without showing it:

```sh
printf '%s' '<key>' | ./gildsite-install key
```

Then run `./gildsite-install run` again. Never repeat the key back in the chat.

This installs Docker if needed, downloads the Gildsite release, starts everything in
Docker (website, panel, database, search), sets up the web server (Caddy) with
HTTPS, and turns on nightly backups. It can take 15–25 minutes. It is safe to run again:
finished parts are skipped.

### Step 5. Connect Aurelius to you (optional, recommended)

Ask first: "Shall I connect myself to your new panel, so you can ask me to work on the website?" After a yes:

```sh
./gildsite-install aurelius          # finds Claude Code or Codex by itself
./gildsite-install aurelius claude   # or name the client: claude, codex, none
```

The script creates an AI Access key in the panel (it can read and write drafts only; a person publishes),
stores it in a file only root can read, and adds the panel as connector `gildsite` to your client
(Claude Code: user scope; Codex: `~/.codex/config.toml`). Then tell the person: "Done. Start a new chat with
me and I will see the panel tools." Never print the key.

Licence rule: a Claude subscription works only inside the person's own Claude Code.
The chat window inside the panel uses an API key the person enters in the panel.

### Step 6. Connect GitHub (optional)

Ask first: "Shall I connect GitHub, so feedback from the panel goes there as issues?" Then ask which
repository (owner/name) and save it:

```sh
./gildsite-install answer GITHUB_REPO your-company/website
./gildsite-install github
```

It prints `GITHUB=WAITING` and a short code. Tell the person: "Open https://github.com/login/device, sign in,
type the code <code> and click Authorize." When they say it is done, run `./gildsite-install github` again.
No token goes through the chat; the panel keeps its own encrypted copy and the installer deletes its copy.

### Step 7. Finish

```sh
./gildsite-install finish
```

It checks that the website and the panel answer, then prints a one-time login link for the
owner. Give the person that link and say: "Log in here. The panel will guide you through
the rest (company details, languages, sign-in, Aurelius)."

## If something goes wrong

- `./gildsite-install status` shows which steps are done.
- Every failure ends with one line `ERROR: <reason>` and one line `FIX: <what to do>`. Tell the person both, in plain words.
- Never retry the same failing step more than twice. Explain and ask how to proceed.
