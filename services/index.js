const fs = require('fs');
const path = require('path');
const generateDocument = require('../utils/generate-document');
const generateFieldData = require('./fields');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendConfirmationCode } = require('../utils/generate-otp');


const serviceDocument = async ({ type, data, otp }) => {
  try {
    const phoneNumber = "6282191722654";

    const otpValid = await prisma.otp.findUnique({
      where: {
        otp: otp,
      },
    });
    if (!otpValid || !otpValid.isValid || otpValid.expiresAt < new Date()) {
      await sendConfirmationCode(phoneNumber);
      throw new Error("OTP tidak valid. OTP baru telah dikirimkan ke nomor Anda.");
    }

    const documentData = await generateFieldData(type, data);
    if (!documentData || Object.keys(documentData).length === 0) {
      throw new Error(`Field untuk dokumen dengan tipe "${type}" tidak ditemukan.`);
    }
    await prisma.otp.delete({
      where: {
        otp: otp,
      },
    })
    const { filePath, no_surat, qrCode } = await generateDocument(type, documentData);
    return {
      filePath,
      no_surat,
      qrCode,
    };
  } catch (error) {
    throw new Error(
      `Terjadi kesalahan dalam proses pembuatan dokumen ${type.toUpperCase()}: ${error.message}`
    );
  }
};

module.exports = {
  serviceDocument,
};
