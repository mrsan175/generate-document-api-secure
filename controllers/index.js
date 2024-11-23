const { serviceDocument } = require('../services');
const {
  allDocumet,
  createDocument,
  deleteDocument,
  document,
  editDocument
} = require('../services/documents');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const validateOtp = async (req, res) => {
  try {
    const { otp } = req.params;
    const result = await prisma.otp.update({
      where: {
        otp: otp,
      },
      data: {
        isValid: true,
      }
    });
    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'OTP tidak ditemukan'
      });
    }
    res.send('OTP berhasil divalidasi');
  } catch (error) {
    res.status(500).send('Server mengalami masalah');
  }
}

const generateDocument = async (req, res) => {
  try {
    const { type, otp } = req.params;
    const data = req.body;
    const result = await serviceDocument({ type, otp, data });
    res.json(result);
  } catch (error) {
    res.status(500).send('Server mengalami masalah');
  }
};

const allDocuments = async (req, res) => {
  try {
    const result = await allDocumet();
    res.status(200).json({
      data: result,
      status: 'success',
      message: 'Data berhasil diambil'
    });
  } catch (error) {
    res.status(500).send('Server mengalami masalah');
  }
}

const getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await document(id);
    res.status(200).json({
      data: result,
      status: 'success',
      message: 'Data berhasil diambil'
    });
  } catch (error) {
    res.status(500).send('Server mengalami masalah');
  }
}

const createDocuments = async (req, res) => {
  try {
    const { data, include } = req.body;
    const result = await createDocument(data, include);
    res.status(200).json({
      data: result,
      status: 'success',
      message: 'Data berhasil ditambahkan'
    });
  } catch (error) {
    res.status(500).send('Server mengalami masalah');
  }
}

const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await editDocument(id, data);
    res.status(200).json({
      data: result,
      status: 'success',
      message: 'Data berhasil diubah'
    });
  } catch (error) {
    res.status(500).send('Server mengalami masalah');
  }
}

const removeDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteDocument(id);
    res.status(200).json({
      data: result,
      status: 'success',
      message: 'Data berhasil dihapus'
    });
  } catch (error) {
    res.status(500).send('Server mengalami masalah');
  }
}

module.exports = {
  generateDocument,
  allDocuments,
  getDocument,
  createDocuments,
  updateDocument,
  removeDocument,
  validateOtp,
};
