# Changelog

## 0.10.0 (2026-11-17)

- New step "Your AI": `answer AI claude|openai|gemini|grok|other`. Claude is recommended (Aurelius's engine is Claude
  Code); for any other choice the installer says one honest sentence: it gets the same rules and panel tools, but some
  skills may work less well. `other` = any provider with an API key (`answer AI_URL`, `answer AI_NAME`) or a model on
  the person's own machine (for example Ollama), often without a key.
- Two ways to log in (`answer AI_LOGIN window|key`): the provider's own window (Claude Code, Codex, Gemini CLI) or an API
  key. The key goes only through the new secure field `ai-key`: the person types it in their own terminal, it is not
  shown and lands in a file only this account can read. Never in the chat, the command line, the log or git.
- New command `ai` (read-only for the server): checks the login or tests the connection (it asks the provider for its
  list of models, nothing is sent to a model) and says `AI=READY` or `AI=WAITING` with the next step for the person.
- The choice (never the key) is saved in `ai.json` and, on a server where Gildsite already runs, in the instance as
  `dane/home/gildsite-ai.json` (`/app/.home/gildsite-ai.json` in the panel). The plan, `status` and the progress card
  show the AI once it is chosen. Changing the AI later does not cancel the earlier yes.
- `aurelius` (auto) picks Codex when the chosen AI is OpenAI and Codex is there.
- Without an AI answer everything works exactly as in 0.9.0, on a server and on a computer.

## 0.9.0 (2026-11-17)

- First question: where Gildsite runs. `answer TARGET server` (a server, as before) or `answer TARGET local` (the
  person's own computer: Mac, Windows with WSL, Linux). Without an answer a Linux machine stays `server`, so existing
  installations work exactly as before; a Mac assumes `local`.
- `check` on a computer looks at the computer (Mac, Windows with WSL, Linux, or Windows without WSL), the processor,
  8 GB of free memory, disk, Docker (running, stopped, no access, missing) and how much memory Docker may use.
- New read-only command `docker-help`: a step-by-step Docker guide for this computer, for the AI to retell one step at
  a time. The installer never installs Docker on a computer.
- On a computer: no DNS step, the installer's files go to `~/gildsite`, the plan says the panel and Aurelius run in
  Docker and the website is only a preview until publishing. `run` checks Docker and stops there with a clear message
  in this version: installing on a computer comes next.
- `answer PUBLISH server|cloudflare` (only on a computer), asked after the first page. It can change later in the chat
  with Aurelius and does not cancel the earlier yes.
- The progress card works on a Mac (bash 3.2, no `/proc`) and says "Computer" instead of "Server" there.
- Version 0.8.0 is left to the Design pull request (#9), which is still waiting.

## 0.7.2 (2026-11-13)

- Night fixes off by default, Pillow for the update check, guide for JOBS and OWNER_LINK.

## 0.7.1 (2026-11-13)

- Set HOME from the account when started without one.

## 0.7.0 (2026-11-13)

- The person chooses scheduled jobs, optional login link, fixes from the first real install.

## 0.6.0 (2026-11-13)

- Newest release and updates from the panel.

## 0.5.0 (2026-11-10)

- Live progress card for the chat.

## 0.4.0 (2026-11-10)

- Fixes from the first test on a real server.

## 0.3.0 (2026-11-09)

- Connect Aurelius and GitHub from the server.

## 0.2.0 (2026-11-09)

- Install step (code, libraries, instance, production mode, owner, Caddy, backup) and finish with a one-time login link.

## 0.1.0 (2026-11-06)

- Skeleton: check, answers, plan, consent, dns, status.
