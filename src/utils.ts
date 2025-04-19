import fs from "fs";
import path from "path";

export function saveLog(channel: string, message: string) {
    const today = new Date().toISOString().split('T')[0]; // Gets YYYY-MM-DD
    const logsDir = path.join(__dirname, '..', 'logs');
    const logFile = path.join(logsDir, `${channel}-${today}.txt`);

    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    // Append message to log file
    fs.appendFileSync(logFile, `${message}\n`);
}

