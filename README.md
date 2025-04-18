# Twitch Chat Bot with Gemini AI

A Twitch chat bot that uses Google's Gemini AI to interact with chat messages. The bot can maintain different personas for different channels and keeps conversation history.

## Prerequisites

- Node.js (version 16 or higher)
- Yarn or npm
- A Twitch account for the bot
- Google Cloud Platform account for Gemini AI

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/chat-dpp-twitch.git
cd chat-dpp-twitch
```

2. Install dependencies
```bash
yarn install
```

## Configuration

### 1. Obtain Twitch Tokens
1. Go to [Twitch Token Generator](https://twitchtokengenerator.com/)
2. Select "Bot Chat Token" from the dropdown
3. Authorize the application
4. You will receive:
   - `access_token`

### 2. Get Google Gemini API Key
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gemini API:
   - Go to "APIs & Services" > "Library"
   - Search for "Generative Language API"
   - Click "Enable"
4. Create API credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### 3. Environment Setup
Create a `.env` file in the project root:

```env
GOOGLE_GENERATIVE_AI_API_KEY==your_gemini_api_key_here
TWITCH_USERNAME=your_bot_twitch_username
TWITCH_ACCESS_TOKEN=
TWITCH_USERNAME=your_username
TWITCH_CHANNELS=channel1,channel2,channel3
```

### 4. Configure Channel Personas
Edit the `channelPersonas` object in `server.ts` to add custom personas for each channel:

```typescript
const channelPersonas = {
  channelname: {
    systemPrompt: 'Custom prompt for this channel'
  }
};
```

## Running the Bot

### Development Mode
```bash
yarn dev
```

### Production Mode
```bash
yarn build
yarn start
```

## Features

- Multi-channel support
- Channel-specific personas
- Conversation history management
- Automatic message context limiting
- Error handling for AI responses


## Troubleshooting

1. If the bot doesn't connect:
   - Verify your Twitch OAuth token is valid
   - Check if the bot account has proper permissions

2. If AI responses fail:
   - Verify your Gemini API key is correct
   - Check if you've enabled billing in Google Cloud Console
   - Verify your API quota hasn't been exceeded

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.