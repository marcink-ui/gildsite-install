# Gildsite installer: instructions for the AI on this server

You are an AI assistant (Claude Code, Codex or similar) running on a server or on the person's own computer.
A person asked you to install Gildsite here. They are **not a programmer**.
Your job: guide them through a short chat, ask for consent once, then let the
`gildsite-install` script do the work. You talk; the script changes the server.

## Golden rules

1. **Speak the person's language**, in short, plain sentences. No jargon. One question at a time.
2. **Nothing changes before consent.** Run only read-only commands (`check`, `plan`, `dns`, `status`, `docker-help`, `ai`) until the person says yes to the plan. Then record it with `consent yes`.
3. **Never print secrets.** Passwords, tokens and keys stay in files the script writes (mode 600). Never echo them into the chat, never ask the person to paste a token into the chat. An AI API key is typed by the person into the installer's secure field (`ai-key`), never into the chat.
4. **Only the script changes the server.** Do not install, delete or reconfigure anything by hand. If a step fails, show the person the one-line reason from the script and the fix it suggests.
5. **Do not touch other services** already running on this server. If `check` reports a conflict (busy port 80/443, low memory), stop and explain the choice in one sentence.
6. **Show progress as a card.** Run `./gildsite-install progress` and show its card in the chat after every step and
   every 1–2 minutes while `run` works (see "Progress card" below). Never paste raw logs.

## The conversation, step by step

### Step 0. Where? (first question)

Ask: **"Where should Gildsite run: on a server on the internet, or on your own computer?"**

| Answer | Save with |
|---|---|
| A server (as before) | `./gildsite-install answer TARGET server` |
| My own computer (Mac, Windows, Linux) | `./gildsite-install answer TARGET local` |

On a Mac the installer already assumes `local`. Without an answer on Linux it assumes `server`, so existing
installations work as before. On a computer, follow "On the person's own computer" below; the rest of this guide is the
server path.

### Step 0b. Look around (read-only)

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

Then ask about scheduled jobs: "Should I turn on a nightly backup and a Knowledge refresh every 15 minutes?
(Update now in the panel is always there.)" Save the choice, for example `./gildsite-install answer JOBS backup`.
The default is `backup,knowledge`; `none` turns both off. Night fixes (`updates`) installing by themselves are
off for now: add them only if the person asks.

If the owner will sign in with Google (a sign-in gate already in front of the panel), no password link is needed:
`./gildsite-install answer OWNER_LINK no`.

### Step 1b. Your AI

Ask: **"Which AI should Aurelius, your assistant in the panel, use: Claude (recommended), OpenAI, Gemini, Grok, or
another one?"**

| Answer | Save with |
|---|---|
| Claude (recommended) | `./gildsite-install answer AI claude` |
| OpenAI (ChatGPT) | `./gildsite-install answer AI openai` |
| Gemini | `./gildsite-install answer AI gemini` |
| Grok | `./gildsite-install answer AI grok` |
| Another provider with an API key, or a model on their own machine | `./gildsite-install answer AI other`, then `answer AI_URL <API address>` and `answer AI_NAME "<name>"` |

When the person picks anything other than Claude, say this one honest sentence (in their language): "It works best with
Claude, because Aurelius's engine is Claude Code. <their choice> gets the same rules and panel tools, but some skills may
work less well." Then respect the choice.

Logging in. Two ways; the installer picks the usual one (Claude, OpenAI, Gemini: the provider's window; Grok, another:
a key). To change it: `answer AI_LOGIN window` or `answer AI_LOGIN key`.

```sh
./gildsite-install ai
```

- **The provider's window**: `ai` says what the person types in a terminal on this machine (for example
  `claude auth login`) and a window or link opens at the provider. The login link or code stays in that terminal and the
  browser. When the provider's program is not here, `ai` says how to get it, or switch to a key.
- **A key**: `ai` says where the person makes the key. The person types it **themselves, in their own terminal** on this
  machine: `./gildsite-install ai-key` (the key is not shown while typing; it goes to a file only this account can read).
  Never ask for the key in the chat and never run `ai-key` with a key yourself. If the person pastes a key into the chat
  anyway, do not use it or repeat it: ask them to delete that key at the provider and make a new one.
- **A model on their own machine** (for example Ollama at `http://127.0.0.1:11434`) usually needs no key: `ai` tests it
  right away.

Run `./gildsite-install ai` again until it says `AI=READY`: the connection was tested and the choice is saved where the
panel sees it (never the key). `AI=WAITING` means the person still has to do the step it shows. The person can change
the AI later; it does not cancel their yes to the plan.

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
owner (skipped when OWNER_LINK is no). Also tell the person how updates work: "When a new Gildsite version is out, the panel shows a dot
in the menu; you click Update now." Give the person that link and say: "Log in here. The panel will guide you through
the rest (company details, languages, sign-in, Aurelius)."

## On the person's own computer (TARGET local)

Gildsite runs on a Mac, on Windows with WSL (Ubuntu inside Windows) or on Linux. The panel and Aurelius run on the
computer in Docker; the website is only a preview on the computer until the person chooses where to publish it.
Nothing goes on the internet, so there is no DNS record and no HTTPS step. The installer keeps its files in `~/gildsite`.

1. `./gildsite-install check`: computer, processor, **8 GB of free memory**, disk and Docker.
2. Docker missing, stopped or not allowed for this account: the installer does **not** install Docker on a computer.
   Run `./gildsite-install docker-help` (read-only) and walk the person through it **one step at a time**, waiting for
   "done" after each. Then `check` again. Also when Docker may use less than 8 GB (Docker Desktop: Settings, Resources).
   Windows without WSL: `docker-help` first shows how to get WSL.
3. Ask for the owner e-mail and the company name (`answer OWNER_EMAIL`, `answer COMPANY`). The website address is
   optional now; it is needed only for publishing. Then ask about the AI, exactly as in "Step 1b. Your AI" above.
4. `./gildsite-install plan`, retell it, ask for a yes, then `consent yes`. `dns` only says nothing is needed.
5. `./gildsite-install run`. **This installer version checks Docker and stops there with a clear message**: installing on a
   computer comes with the next installer version. Tell the person the computer is ready and the answers are saved.

Later, after the first page, ask where the website should go public:

| Answer | Save with |
|---|---|
| "On a server" | `./gildsite-install answer PUBLISH server` |
| "Cloudflare (free hosting for the website)" | `./gildsite-install answer PUBLISH cloudflare` |

The person can change this choice later in the chat with Aurelius; it does not cancel their earlier yes. Publishing
itself asks for its own yes. Any key or token for publishing goes only through the installer's secure input (like
`key`), never into the chat.

## Progress card

`run` takes 15–25 minutes. Start it in the background (Claude Code: run the command in the background; otherwise
`nohup ./gildsite-install run > /srv/gildsite/.install/run.out 2>&1 &`), then show the card every 1–2 minutes until it says
the install is done or stopped:

- If your chat can draw HTML widgets (for example Claude in the Claude app), render the output of
  `./gildsite-install progress --html` as a widget, in the conversation itself.
- Otherwise (terminal: Claude Code, Codex) paste the output of `./gildsite-install progress` in a code block.
- `./gildsite-install progress --json` gives the same data for anything else.

The card shows the steps, how much is done, minutes left, the server's memory and disk, the last few things the
installer did, and "Your move" (what the person has to do now, or "Nothing"). Translate the card's words into the
person's language when you retell it. It never contains passwords, keys or links.

## If something goes wrong

- `./gildsite-install status` shows which steps are done.
- Every failure ends with one line `ERROR: <reason>` and one line `FIX: <what to do>`. Tell the person both, in plain words.
- Never retry the same failing step more than twice. Explain and ask how to proceed.
