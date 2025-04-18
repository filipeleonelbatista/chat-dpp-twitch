import 'dotenv/config';
import tmi from 'tmi.js';
import express from 'express';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { COLONOGAMER_CONTEXT } from './contexts/colonogamer';

interface PersonaConfig {
    systemPrompt: string;
}

interface ChannelPersonas {
    [key: string]: PersonaConfig;
}

interface ConversationMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface ConversationHistory {
    [key: string]: ConversationMessage[];
}

const client: tmi.Client = new tmi.Client({
    options: { debug: true },
    identity: {
        username: process.env.TWITCH_USERNAME ?? '',
        password: `oauth:${process.env.TWITCH_ACCESS_TOKEN ?? ''}`
    },
    channels: process.env.TWITCH_CHANNELS?.split(',') || []
});

const channelPersonas: ChannelPersonas = {
    colonogamer: {
        systemPrompt: `
        Você é o assistente oficial do canal Colonogamer na Twitch, use o estilo e informações do apresentador. 
        Essas são as informações sobre o apresentador: ${COLONOGAMER_CONTEXT}
        `,
    },
};

const conversationHistory: ConversationHistory = {};

client.on('message', async (
    channel: string,
    tags: tmi.ChatUserstate,
    message: string,
    self: boolean
) => {
    if (self) return;

    const botUsername = process.env.TWITCH_USERNAME?.toLowerCase() ?? 'chatdpp';
    const messageContent = message.toLowerCase();

    if (!messageContent.includes(`@${botUsername}`)) {
        return;
    }

    const name = channel.slice(1);
    const persona = channelPersonas[name];
    if (!persona) return;

    if (!conversationHistory[name]) {
        conversationHistory[name] = [{ role: 'system', content: persona.systemPrompt }];
    }

    const isSubscriber = tags.subscriber;
    const isMod = tags.mod;
    const isBroadcaster = tags.badges?.broadcaster === '1';
    const isVIP = tags.badges?.vip === '1';

    let userStatus = [];
    if (isBroadcaster) userStatus.push('(Dono)');
    if (isMod) userStatus.push('(Mod)');
    if (isVIP) userStatus.push('(VIP)');
    if (isSubscriber) userStatus.push('(Sub)');
    if (userStatus.length === 0) userStatus.push('(Viewer)');

    conversationHistory[name].push({
        role: 'user',
        content: `${tags['display-name'] || tags.username} ${userStatus.join(' ')}: ${message}`
    });

    const systemMessage = conversationHistory[name][0];
    const recentMessages = conversationHistory[name].slice(-19);
    const recent = [systemMessage, ...recentMessages];

    try {
        const res = await generateText({
            model: google('gemini-1.5-flash'),
            messages: recent,
        });
        const reply = res.text;

        conversationHistory[name].push({ role: 'assistant', content: reply });

        await client.say(channel, reply);
    } catch (error) {
        console.error('Erro ao gerar texto com IA:', error instanceof Error ? error.message : error);
    }
});

client.connect().catch((error: Error) => console.error('Connection error:', error));

console.log('Bot is running...');


const app = express();
const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
    const status = {
        botUsername: process.env.TWITCH_USERNAME,
        connectedChannels: client.getChannels(),
        isConnected: client.readyState() === 'OPEN',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    };

    res.json(status);
});

app.listen(PORT, () => {
    console.log(`Status API running on https://chat-dpp-twitch.onrender.com:${PORT}`);
});