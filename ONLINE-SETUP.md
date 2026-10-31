# Little Lives online lobby setup

The online lobby uses Supabase Realtime. GitHub Pages serves the game files, while Supabase carries live player presence and temporary chat messages. Players do not need accounts. Admin is behind a four-digit passcode prompt.

## Create the shared lobby

1. Create a free project at [supabase.com](https://supabase.com/).
2. In the Supabase dashboard, copy the project's **Project URL** and its **publishable key** (or legacy **anon** key). These are browser-side public values. **Never use or publish a `service_role` or secret key.**
3. Open `online-config.js` and fill in the two values:

   The Admin passcode is `0000`.
4. Publish the updated game files to the root of the `main` branch on GitHub.
5. Players can choose a nickname on the Online page and select **Join lobby**. To open Admin, click **Admin passcode** and enter `0000`.

The project must allow public Realtime channels. The game uses one public channel and does not create database tables or persist chat. If joining fails, check that Realtime is enabled for the Supabase project and that the URL/key were copied correctly.

The passcode check is implemented in browser-side JavaScript on a public website. It is only a casual screen lock: anyone can inspect the published code or bypass the check. Do not use it to protect private data or important controls. The Admin panel only edits that browser's local game and does not grant control over other players' lives. Real owner-only security requires server-side authentication and authorization.

## Privacy and limitations

The lobby is public and anonymous. While online, players share their nickname, age, job, education, health, happiness, and up to three recent journal moments. Chat is broadcast live and is not saved; new arrivals do not see earlier messages. Do not share personal information. The browser applies a message length and send-rate limit, but this simple public lobby does not include accounts, moderation, or server-enforced rate limits.
