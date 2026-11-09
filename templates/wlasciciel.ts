// Gildsite installer: owner account. Copied by gildsite-install into app/tools/ of the instance and run with
//   npx payload run tools/gildsite-install-wlasciciel.ts   (container "narzedzia"), e-mail in OWNER_EMAIL.
// 1. Gives the seeded owner account (wlasciciel@<domain>) the person's e-mail. Runs once; later runs find the e-mail already set.
// 2. With TYLKO_LINK=1: only prints LINK-TOKEN=<token> for a one-time "set your password" link (valid 1 hour).
// 3. With COMPANY set: puts the company name in settings and the footer.
// Never prints passwords.
import { getPayload } from 'payload'
import cfg from '../src/payload.config'

const email = String(process.env.OWNER_EMAIL ?? '').trim().toLowerCase()
const end = (code: number, text: string) => { console.log(text); process.exit(code) }
if (!email.includes('@')) end(2, 'OWNER_EMAIL missing.')

const payload = await getPayload({ config: cfg })
const find = async (e: string) => (await payload.find({ collection: 'users', where: { email: { equals: e } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]

if (process.env.TYLKO_LINK === '1') {
  if (!(await find(email))) end(3, `No account ${email}.`)
  const token = await payload.forgotPassword({ collection: 'users', data: { email }, disableEmail: true })
  end(0, `LINK-TOKEN=${token}`)
}

// Company name from the installer answers (seed used the technical instance name): settings and footer.
const company = String(process.env.COMPANY ?? '').trim()
if (company) {
  const settings: any = await payload.findGlobal({ slug: 'ustawienia', depth: 0, overrideAccess: true })
  await payload.updateGlobal({ slug: 'ustawienia', data: { ...settings, firma: company }, overrideAccess: true })
  const footer: any = await payload.findGlobal({ slug: 'stopka', depth: 0, overrideAccess: true })
  await payload.updateGlobal({ slug: 'stopka', data: { ...footer, tekst: `© ${company}` }, overrideAccess: true })
}

if (await find(email)) end(0, `Owner account ${email} already set.`)
const owners = await payload.find({ collection: 'users', where: { rola: { equals: 'wlasciciel' } }, sort: 'createdAt', limit: 1, depth: 0, overrideAccess: true })
const owner = owners.docs[0]
if (!owner) end(4, 'No owner account found in the database.')
await payload.update({ collection: 'users', id: owner.id, data: { email }, overrideAccess: true })
end(0, `Owner account now uses ${email}.`)
