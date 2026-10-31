# Little Lives online setup

The online lobby uses Supabase Realtime. GitHub Pages serves the game files, while Supabase carries live player presence and temporary chat messages. Players do not need accounts to use the lobby. Owner access to the local Admin page uses a six-digit email code sent through Supabase Auth.

## Configure Supabase

1. Create a project at [supabase.com](https://supabase.com/).
2. In the Supabase dashboard, copy the project's **Project URL** and **publishable key** (or legacy **anon** key). These are browser-side public values. **Never use or publish a `service_role` or secret key.**
3. Add the values to `online-config.js`. The owner email hash is configured there separately; do not put the owner's email address in the public configuration.
4. In Supabase Auth, ensure the owner email is an existing user. Sign-in requests disable account creation.
5. In **Authentication → SMTP Settings**, enable custom SMTP and add the credentials from your email provider. Supabase's built-in sender only delivers to authorized project team addresses and is limited to two emails per hour; it is not intended for reliable delivery to Gmail accounts. Never put SMTP credentials in this repository.
6. In **Authentication → Email Templates**, configure the Magic Link template to include `{{ .Token }}` so the email contains a six-digit code. The built-in template might send a sign-in link instead. Custom SMTP is required to edit email templates.
7. Publish the updated game files to the root of the `main` branch on GitHub.

Players can choose a nickname on the Online page and select **Join lobby**. To open Admin, click **Owner sign-in**, enter the owner email, then enter the code from the email. The game does not request a redirect URL; code verification happens in the same page. An email is sent only after the owner submits the email form successfully.

The project must allow public Realtime channels. The game uses one public channel and does not create database tables or persist chat. If joining fails, check that Realtime is enabled and that the URL/key were copied correctly. If a code email does not arrive, check Spam/All Mail, verify Auth email delivery and SMTP configuration, and confirm the Magic Link template contains `{{ .Token }}`. Supabase's built-in sender rejects non-team recipient addresses and has a two-email-per-hour project limit.

## Admin security limitations

The email-code flow verifies an authenticated Supabase session and compares its email with the configured owner email hash. However, this is a static website: the Admin panel only edits the current browser's local game and does not grant control over other players' lives. Do not use this client-side gate to protect server data or privileged backend actions. Those require server-side authorization and policies.

## Privacy and limitations

The lobby is public and anonymous. While online, players share their nickname, age, job, education, health, happiness, and up to three recent journal moments. Chat is broadcast live and is not saved; new arrivals do not see earlier messages. Do not share personal information. The browser applies a message length and send-rate limit, but this simple public lobby does not include accounts, moderation, or server-enforced rate limits.
