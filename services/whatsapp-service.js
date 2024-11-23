const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const qrcode = require('qrcode-terminal');

const client = new Client({
    restartOnAuthFail: true,
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2410.1.html',
    },
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ],
    },
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('QR Code diterima. Silakan scan menggunakan aplikasi WhatsApp.');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Client siap digunakan!');
});

client.on('authenticated', () => {
    console.log('Client berhasil diautentikasi!');
});

client.on('auth_failure', (msg) => {
    console.error('Autentikasi gagal:', msg);
});

client.on('disconnected', (reason) => {
    console.error('Client terputus:', reason);
});

const sendWhatsAppMessage = async (phoneNumber, message) => {
    try {
        console.log(`Mengirim pesan ke ${phoneNumber}: ${message}`);
        await client.sendMessage(`${phoneNumber}@c.us`, message);
        console.log('Pesan berhasil dikirim!');
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw new Error('Gagal mengirim pesan WhatsApp');
    }
};

client.initialize();

module.exports = { sendWhatsAppMessage };
