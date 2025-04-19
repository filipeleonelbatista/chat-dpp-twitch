interface UserCooldown {
    lastMessage: number;
    messageCount: number;
}

interface CooldownManager {
    [key: string]: UserCooldown;
}

const COOLDOWN_PERIOD = 60 * 1000;
const MAX_MESSAGES = 3;
const cooldowns: CooldownManager = {};

export function isUserSpamming(userId: string): boolean {
    const now = Date.now();
    const userCooldown = cooldowns[userId];

    if (!userCooldown) {
        cooldowns[userId] = {
            lastMessage: now,
            messageCount: 1
        };
        return false;
    }

    if (now - userCooldown.lastMessage > COOLDOWN_PERIOD) {
        cooldowns[userId] = {
            lastMessage: now,
            messageCount: 1
        };
        return false;
    }

    userCooldown.messageCount++;
    userCooldown.lastMessage = now;

    return userCooldown.messageCount > MAX_MESSAGES;
}