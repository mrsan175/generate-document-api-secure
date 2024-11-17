const { serviceDocument } = require('../services');

const generateDocument = async (req, res) => {
  try {
    const { type } = req.params;
    const data = req.body;
    const result = await serviceDocument({ type, data });
    res.json(result);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  generateDocument,
};
