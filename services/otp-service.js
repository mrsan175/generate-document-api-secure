const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const generateAndStoreOtp = async (phoneNumber, otp) => {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await prisma.otp.upsert({
        where: {
            phoneNumber: phoneNumber,
        },
        update: {
            otp: otp,
            expiresAt: expiresAt,
        },
        create: {
            phoneNumber: phoneNumber,
            otp: otp,
            expiresAt: expiresAt,
        },
    });

    console.log('OTP berhasil disimpan untuk nomor:', phoneNumber);
};

module.exports = { generateAndStoreOtp };