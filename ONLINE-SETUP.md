# Little Lives online lobby setup

The online lobby uses Supabase Realtime. GitHub Pages serves the game files, while Supabase carries live player presence and temporary chat messages. Players do not need accounts. The game owner signs in with a verified six-digit email code to access the private Admin page.

## Create the shared lobby

1. Create a free project at [supabase.com](https://supabase.com/).
2. In the Supabase dashboard, copy the project's **Project URL** and its **publishable key** (or legacy **anon** key). These are browser-side public values. **Never use or publish a `service_role` or secret key.**
3. Open `online-config.js` and fill in the two values:

   ```js
   window.LITTLE_LIVES_ONLINE_CONFIG = {
     projectUrl: 'https://your-project-id.supabase.co',
     publishableKey: 'your-public-publishable-or-anon-key',
     adminEmailHash: 'sha256-of-the-owner-email',
   };
   ```

   To make the email hash, normalize the owner's email to lowercase and remove surrounding spaces, then calculate its SHA-256 hash as 64 lowercase hexadecimal characters. The raw email is not stored in the public game files.
4. In Supabase **Authentication → Email Templates → Magic Link**, change the email body to include the one-time code, for example:

   ```html
   <h2>Your Little Lives sign-in code</h2>
   <p>Enter this six-digit code in the game to open the Admin panel:</p>
   <p><strong>{{ .Token }}</strong></p>
   <p>This code expires shortly. Never share it with anyone.</p>
   ```

   Make sure the template uses `{{ .Token }}` and does not rely on `{{ .ConfirmationURL }}`. Supabase sends a numeric code; the game verifies it directly, so no sign-in link or redirect URL configuration is required.
5. Publish the updated `index.html`, `script.js`, `style.css`, `online.js`, and `online-config.js` to the root of the `main` branch on GitHub.
6. Players can choose a nickname on the Online page and select **Join lobby**. To access Admin, the owner selects **Owner sign-in**, requests a code, and enters the six digits received at the configured email.

The project must allow public Realtime channels. The game uses one public channel and does not create database tables or persist chat. If joining fails, check that Realtime is enabled for the Supabase project and that the URL/key were copied correctly.

The Admin menu and page stay hidden unless the signed-in Supabase Auth user's verified email matches the configured SHA-256 email hash. The email hash is a public identifier, not a password; access depends on control of the matching email inbox. This client-side Admin panel only edits that browser's local game and does not grant control over other players' lives.

## Privacy and limitations

The lobby is public and anonymous. While online, players share their nickname, age, job, education, health, happiness, and up to three recent journal moments. Chat is broadcast live and is not saved; new arrivals do not see earlier messages. Do not share personal information. The browser applies a message length and send-rate limit, but this simple public lobby does not include accounts, moderation, or server-enforced rate limits.
