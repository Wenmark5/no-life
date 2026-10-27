# Little Lives online lobby setup

The online lobby uses Supabase Realtime. GitHub Pages serves the game files, while Supabase carries live player presence and temporary chat messages. No player accounts or database tables are required.

## Create the shared lobby

1. Create a free project at [supabase.com](https://supabase.com/).
2. In the Supabase dashboard, copy the project's **Project URL** and its **publishable key** (or legacy **anon** key). These are browser-side public values. **Never use or publish a `service_role` or secret key.**
3. Open `online-config.js` and fill in the two values:

   ```js
   window.LITTLE_LIVES_ONLINE_CONFIG = {
     projectUrl: 'https://your-project-id.supabase.co',
     publishableKey: 'your-public-publishable-or-anon-key',
   };
   ```

4. Publish the updated `index.html`, `script.js`, `style.css`, `online.js`, and `online-config.js` to the root of the `main` branch on GitHub. All players then use the same public lobby.
5. Open the game, choose a nickname on the Online page, and select **Join lobby**. Players can visit online profiles and chat while connected.

The project must allow public Realtime channels. The game uses one public channel and does not create database tables or persist chat. If joining fails, check that Realtime is enabled for the Supabase project and that the URL/key were copied correctly.

## Privacy and limitations

The lobby is public and anonymous. While online, players share their nickname, age, job, education, health, happiness, and up to three recent journal moments. Chat is broadcast live and is not saved; new arrivals do not see earlier messages. Do not share personal information. The browser applies a message length and send-rate limit, but this simple public lobby does not include accounts, moderation, or server-enforced rate limits.
