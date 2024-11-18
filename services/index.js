const fs = require('fs');
const path = require('path');
const generateDocument = require('../utils/generate-document');
const generateFieldData = require('./fields');
const { uploadFileToApi } = require('../api');
const convertToPdf = require('../utils/convert-to-pdf'); // Import fungsi konversi

const serviceDocument = async ({ type, data }) => {
  try {
    const documentData = await generateFieldData(type, data);
    if (!documentData || Object.keys(documentData).length === 0) {
      throw new Error(`Field untuk dokumen dengan tipe "${type}" tidak ditemukan.`);
    }
    const { filePath, no_surat } = await generateDocument(type, documentData);
    const pdfPath = await convertToPdf(filePath);
    const fileBuffer = fs.readFileSync(pdfPath);
    const fileName = path.basename(pdfPath);
    const uploadResult = await uploadFileToApi(fileBuffer, fileName);
    if (!uploadResult || !uploadResult.success) {
      throw new Error('Gagal mengunggah file ke API eksternal.');
    }
    fs.unlinkSync(filePath); // Hapus file Word
    fs.unlinkSync(pdfPath); // Hapus file PDF
    return {
      filePath: uploadResult.fileUrl || pdfPath, // URL file PDF dari API
      no_surat,
      uploadResult,
      message: `Dokumen ${type.toUpperCase()} berhasil diupload dan dikonversi ke PDF`,
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
