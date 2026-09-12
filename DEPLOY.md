# Deploying fadasalem.salemministry.org

This is the SALEM Abundant Life Ministry church/community site, adapted to
run as its own project at **fadasalem.salemministry.org**, fully on Vercel
— no PHP hosting needed anywhere. Below is everything you need to do,
in order, to get it live.

## What changed from the original archive

- Every hardcoded `https://salemministry.org/images/...` URL now points to
  `/images/...` — the site carries its own images (in `public/images/`)
  instead of depending on a folder living on the main domain.
- **The 13 images currently in `public/images/` are placeholders** (green/
  gold branded cards, not real photos) so the site can go live looking
  intentional rather than broken while you gather the real ones. When you
  have the real photos, just replace the file at the same path/filename
  (see the list at the bottom of this doc) — no code changes needed.
- The weekly-bulletin upload feature (RPSD) no longer calls
  `rpsd_upload.php` on a PHP server. It now uploads straight to **Vercel
  Blob** storage via two new files, `api/rpsd-upload.ts` and
  `api/rpsd-delete.ts` — the same storage approach already used by the
  Podcasts/Radio uploads on the main School of Witnessing app. `rpsd_upload.php`
  has been removed from this project entirely.
- The Virtual Prayer Room (Whereby + Firebase) is untouched — it stays its
  own independent system, separate from SALEM-Hub on the main app, per
  your call.

## Step 1 — Push this to GitHub

```bash
cd fadasalem-site
git init
git add .
git commit -m "Initial commit: fadasalem.salemministry.org"
```

Then create a new (empty) repository on GitHub and push to it:

```bash
git remote add origin https://github.com/<your-username>/fadasalem-site.git
git branch -M main
git push -u origin main
```

## Step 2 — Create a new Vercel project

This must be a **separate** Vercel project from the School of Witnessing
app — not a route inside it, since they're two different codebases.

1. Go to vercel.com → **Add New… → Project**
2. Import the `fadasalem-site` GitHub repo you just pushed
3. Framework preset: Vercel should auto-detect **Vite** — leave the
   build settings as default (`npm run build`, output directory `dist`)
4. Don't deploy yet — first add the environment variables below

## Step 3 — Environment variables

In the new project's **Settings → Environment Variables**, add:

| Name | Value |
|---|---|
| `RPSD_API_KEY` | any long random string, e.g. `openssl rand -hex 32` |
| `VITE_RPSD_API_KEY` | **the exact same string** as above |

These two must match exactly — one is read by the upload API, the other is
baked into the browser bundle so the admin dashboard can send it. (This is
the same shared-secret approach the original PHP script used — just no
longer hardcoded into a file that ships in the git repo.)

## Step 4 — Enable Vercel Blob storage

Still in the project: **Storage tab → Create Database → Blob**. Follow the
prompts to connect it to this project. Vercel will automatically add a
`BLOB_READ_WRITE_TOKEN` environment variable for you — you don't need to
set that one by hand.

Now deploy the project (or redeploy, if it already tried once before you
added the env vars).

## Step 5 — Add the subdomain

In the project's **Settings → Domains**, add `fadasalem.salemministry.org`.

Vercel will show you a DNS record to create. Since you manage
salemministry.org's DNS yourself:

- If `salemministry.org`'s nameservers are **already Vercel's** (likely,
  since the main School of Witnessing app is on Vercel too) — Vercel may
  offer to add the record automatically with one click, since it already
  controls that DNS.
- Otherwise, go to wherever you manage the domain's DNS records and add
  exactly what Vercel's Domains page shows you — normally a **CNAME**
  record: `fadasalem` → `cname.vercel-dns.com`.

DNS changes can take a few minutes to a few hours to take effect. Vercel's
Domains page will show a green checkmark once it's live and the SSL
certificate is issued automatically.

## Step 6 — Firebase: authorize the new domain

Without this step, admin login (RPSD, the "coming soon" gates, etc.) will
fail on the new subdomain with an `auth/unauthorized-domain` error.

Firebase Console → your `salem-ministry-cm` project → **Authentication →
Settings → Authorized domains → Add domain** → enter
`fadasalem.salemministry.org`.

## Step 7 — Firestore: add the missing RPSD security rule

I checked your own documented rules in `backup/SALEM_TECHNICAL.md` against
what the RPSD feature actually needs, and found a gap: the published rules
cover `config`, `participants`, `scheduledSessions`, `prayerIntentions`,
and `notificationSubscribers` — but not the `rpsd_weeks` collection the
weekly-bulletin feature reads and writes. Firestore denies anything not
explicitly allowed, so without this, RPSD will silently fail to load or
save anything once deployed.

Firebase Console → Firestore Database → Rules, and add this block inside
`service cloud.firestore { match /databases/{database}/documents { ... } }`,
alongside the existing rules (same public-read/admin-write shape as
`scheduledSessions`):

```javascript
// ===== RPSD (weekly bulletin) =====
// Lecture: Publique (les fidèles téléchargent le bulletin)
// Écriture: Admin uniquement
match /rpsd_weeks/{weekId} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

Then click **Publish**.

## Step 8 — Verify

Once DNS and SSL are both green in Vercel:

1. Visit `https://fadasalem.salemministry.org` and click through Home,
   About, Events, Sermons, Gallery, Salem TV, Contact
2. Log in as admin and try the RPSD upload flow end-to-end (upload a test
   PDF, confirm it appears, then delete it)
3. Try the Virtual Prayer Room's Whereby flow

## Replacing the placeholder photos

When you have the real files, just overwrite these in `public/images/`
(same filenames, so no code changes are needed), commit, and push — Vercel
redeploys automatically:

```
peresalem4.jpeg   — Fada Salem's portrait (About page)
IMG_2599.jpeg      — worship / Adoration
IMG_2367.jpeg      — prayer / Prière
IMG_2391.jpeg      — community / Communauté
IMG_2463.jpeg      — events / Événements
IMG_2628.jpeg      — events / Retraite
IMG_2636.jpeg      — worship / Louange
img5.jpg           — ministry
img7.jpg           — prayer / Intercession
img9.jpg           — community / Famille
IMG_2319.jpeg      — community / Assemblée
logosalem.png      — ministry logo (header, footer, favicons)
icosalem.png       — small favicon/tile icon
```
