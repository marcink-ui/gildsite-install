# Changelog

## 0.8.0 (2026-11-16)

- Design is connected on every installation (the owner's decision of 16.11; before, it was off). New step 8/8 of `run`
  and a command `design` to try again later. Skip it with `answer DESIGN no`.
- Design gets its own containers and its own database (`postgres:16`) in `/srv/doop-<instance>`, joined to the instance
  network with the alias `design`. Its secrets are random, kept in a `.env` only root can read, never in logs.
- Its own address `design.<domain>` in Caddy: only the panel may show it in a frame, `/ws` passes WebSockets,
  `X-Robots-Tag: noindex`. Nobody can sign up from outside. With an existing nginx the installer writes a ready file.
- `dns` shows the second record; `run` checks it before Caddy asks for a certificate. Without it, Design waits
  with a clear message and the website works anyway.
- The panel gets `DESIGN_ADRES`, `DESIGN_KLUCZ` and `DESIGN_PUBLICZNY` (a copy of its `.env` is kept first),
  restarts alone and is checked at `/admin/login`.
- The Design image comes from a registry (with the read-only download key), an image file or a source folder:
  `answer DESIGN_IMAGE`.
- The Caddyfile is written in place, so Caddy sees changes after a reload.

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
