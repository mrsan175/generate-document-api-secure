const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const crypto = require('crypto');
const { sendWhatsAppMessage } = require('../services/whatsapp-service');


const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};


const sendConfirmationCode = async (phoneNumber) => {
    const code = generateOTP();
    const message = `http://192.168.1.101:8000/api/validate-otp/${code}`;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // OTP berlaku selama 5 menit

    await prisma.otp.upsert({
        where: {
            phoneNumber: phoneNumber,
        },
        update: {
            otp: code,
            expiresAt: expiresAt,
        },
        create: {
            phoneNumber: phoneNumber,
            otp: code,
            expiresAt: expiresAt,
        },
    });

    console.log('OTP berhasil disimpan untuk nomor:', phoneNumber);
    await sendWhatsAppMessage(phoneNumber, message);
};

module.exports = { generateOTP, sendConfirmationCode };