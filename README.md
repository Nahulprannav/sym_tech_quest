# Project Cipher

Responsive static site for the five-stage Tech Quest treasure hunt, published with GitHub Pages.

## Supabase setup

1. Create a Supabase project.
2. In **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql). It creates the `completions` table and row-level security policies.
3. In **Authentication → Sign In / Providers → User signups**, disable public sign-ups. Then create an organizer user from **Authentication → Users → Add user**. Only organizers with accounts should be able to read the results table.
4. Copy the project URL and the **publishable key** from the Connect dialog or **Project Settings → API Keys**. A legacy public anon key also works. The publishable/anon key is designed to be public; do not use a `service_role` or secret key in this website.
5. Open the live [organizer page](https://nahulprannav.github.io/sym_tech_quest/organizer.html). Enter the public site base URL, Supabase project URL, and public publishable key. Generate the five QR codes and replace any older printed codes.
6. Sign in to the organizer completion table at the bottom of that page. It lists the station score, completion time, key/final phrase, and team for each event record.

Station QR codes include the Supabase URL and public publishable key so participants' phones can submit results. The public database role can insert but cannot read rows. The organizer table uses Supabase Auth, and reads are limited to authenticated users. Keep public sign-ups disabled and never put a secret/service-role key in the site.

Repeated page loads do not create duplicate records: each team name and station has a stable event ID, and the client ignores a duplicate insert. Station 5 checkpoint and mission finish are separate records. Station submissions are asynchronous, so organizers should refresh the table if a result has not appeared yet.

## Event notes

- Station 2 asks teams to use a browser developer console. Many mobile browsers do not provide one; have a coordinator device/lab computer or a shared team laptop there.
- The station puzzle keys are part of this static site and can be inspected by a determined player. Supabase protects the event log; it does not conceal the puzzle answers.
- For the five teams, answer keys are in the site source and should be kept for organizer reference only.
