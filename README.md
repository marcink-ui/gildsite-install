# Gildsite installer

Install Gildsite (website, panel, Design and the Aurelius AI assistant) on your own server, by chatting with the AI that already runs there. No coding.

## How to use it

1. Open the AI on your server (Claude Code, Codex or similar).
2. Paste this sentence:

   > Install Gildsite on this server using https://github.com/marcink-ui/gildsite-install. Follow INSTALL-FOR-AI.md and guide me.

3. Answer its questions and say yes to the plan.
4. Add the DNS record it shows you at your domain provider.
5. Open the login link it gives you at the end.

About 10 minutes of your time. The installation itself takes 15–25 minutes.

## What you need

- A server with Ubuntu or Debian, at least 8 GB of memory and 30 GB of free disk.
- A domain name you can edit (to add one DNS record).
- Optional: a GitHub account, if you want feedback and code changes to go there.

## Safety

- Nothing changes on the server until you say yes to the plan.
- Passwords and keys are stored only in files on the server, never shown in the chat.
- Other programs on the server are not touched.

Status: version 0.5.0. Installing the website and panel works, with a live progress card for the chat (tested on a clean machine and on a server that already runs nginx). Connecting Aurelius (Claude Code, Codex) works and needs Gildsite 9cbf11d or newer. Connecting GitHub uses a device login and still has to be tried on a real server.
