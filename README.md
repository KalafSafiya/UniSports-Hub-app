# UniSports Hub

University sports management with a React frontend, Express API, MySQL for users/teams/bookings and MongoDB for news/announcements.

## Local setup

Use Node.js 22 and npm. Run MySQL and MongoDB locally, or supply connection details for your development databases.

1. Run `npm ci` separately in `backend` and `frontend`.
2. Copy each directory's `.env.example` to `.env` and fill in your values. Set a unique JWT secret. Never commit real credentials.
3. In `backend` run `npm start` (or `npm run dev`). Startup creates missing MySQL tables and connects to MongoDB before listening on port 5000. The MySQL account needs database creation permission. Existing schemas are not automatically migrated or overwritten.
4. In `frontend` run `npm start` and open http://localhost:3000. Restart the frontend after changing its API URL.

For a fresh database, after the tables exist, set ADMIN_NAME, ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD in your local backend environment, then run `node scripts/createAdmin.js` from `backend`. Use at least 12 password characters. The script creates an Admin without exposing a public registration endpoint, and refuses to overwrite an existing account. Remove the bootstrap variables afterward. Existing administrators can create coaches through Manage Coaches.

EMAIL_USER and EMAIL_PASS configure Gmail booking notifications. A notification failure is reported separately after the booking decision is saved.

## Verification

- Backend: `npm test` from `backend` (30 regression tests using isolated database/mail substitutes).
- Frontend: `npm test -- --watchAll=false --runInBand` from `frontend` (5 tests).
- Production bundle: `npm run build` from `frontend`.

The frontend Jest mappings support React Router 7 with the older test runner included in react-scripts. Tailwind uses version 2's purge configuration.

A live end-to-end check still requires configured MySQL, MongoDB and email credentials. Verify guest booking/contact submissions, administrator approvals, coach team edits and attachment downloads against your development databases. Automated substitutes do not verify existing database schema compatibility or concurrent booking approvals.

## Access behavior

Guest pages can read announcements, news, approved schedules and venues. Administrator APIs enforce the current account role. Deactivated accounts cannot reuse existing tokens. Coaches may edit/delete their own teams; edits return teams to administrator review. Contact attachments are downloaded through authenticated requests.

## Sync the changes

This review creates 15 local commits on main and does not push them. In VS Code Source Control, choose **Sync Changes** to publish them to origin/main, or run `git push origin main`. If GitHub has newer commits, pull and resolve any conflicts before pushing. Do not force-push.
