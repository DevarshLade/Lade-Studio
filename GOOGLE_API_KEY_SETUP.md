# How to Get Google Gemini API Key

## Step 1: Go to Google AI Studio
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account

## Step 2: Create API Key
1. Click on "Get API key" in the left sidebar
2. Click "Create API key in new project" (or select an existing project)
3. Copy the generated API key

## Step 3: Add API Key to Environment
1. Open your `.env.local` file
2. Replace `your-gemini-api-key-here` with your actual API key:
   ```
   GEMINI_API_KEY=your-actual-api-key-here
   ```

## Step 4: Restart Development Server
After updating the environment variable, restart your development server:
```bash
npm run dev
```

## Alternative: Use GOOGLE_API_KEY
If you prefer, you can use `GOOGLE_API_KEY` instead of `GEMINI_API_KEY`:
```
GOOGLE_API_KEY=your-actual-api-key-here
```

## Important Notes
- Keep your API key secure and never commit it to version control
- The API key is used for the AI-powered artwork suggestions feature
- You may need to enable billing in Google Cloud Console for higher usage limits

## Troubleshooting
If you still get errors after adding the API key:
1. Make sure you copied the key correctly (no extra spaces)
2. Restart your development server completely
3. Check that the Google AI API is enabled in your Google Cloud project
4. Verify your API key has the necessary permissions