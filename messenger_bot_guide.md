# 🤖 Messenger Bot Setup Guide: Swaktorie Meals

This guide explains how to deploy your automated BMI bot to Facebook Messenger.

## 🚀 Step 1: Prepare your Files
Node.js servers need a `package.json` file to run on Render. I've already created this for you in your folder.

1.  Make sure you have these two files ready:
    - `swaktorie_messenger_bot.js`
    - `package.json`
2.  **Upload them to GitHub**: Create a private repository on [GitHub.com](https://github.com) and upload these two files there.

## 🛠️ Step 2: Deploy to Render.com
Now, on the Render screen you're looking at:
1.  Click **"New Web Service"** (the second box in your screenshot).
2.  Connect your GitHub account.
3.  Select the repository you just created.
4.  Render will automatically see your `package.json` and set everything up!

## 🛠️ Step 2: Meta Developer Portal
1. Go to [developers.facebook.com](https://developers.facebook.com) and create a **New App**.
2. Add the **Messenger** product to your app.
3. Link your **Swaktorie Meals Facebook Page**.
4. Generate a **Page Access Token** and paste it into line 14 of `swaktorie_messenger_bot.js`.
5. Under **Webhooks**, click "Setup Subscriptions":
   - **Callback URL**: `https://your-server-url.com/webhook`
   - **Verify Token**: `SWAKTORIE_SECRET_TOKEN` (must match line 13 of the code).
   - **Subscription Fields**: Select `messages` and `messaging_postbacks`.

## 🧪 Step 3: Test It
1. Open your Facebook Page in Messenger.
2. Type **"BMI"**.
3. The bot should reply and guide you through the calculation!

> [!TIP]
> **Production Note:** The current script uses "In-Memory" state, meaning if the server restarts, it forgets where a user was. For a permanent solution, I recommend adding a simple database like MongoDB or Redis.
