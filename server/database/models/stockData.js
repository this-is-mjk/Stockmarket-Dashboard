const mongoose = require("mongoose");

const createStockSchema = () => {
  return new mongoose.Schema({
    timestamp: {
      type: Date,
      required: true,
    },
    open: {
      type: Number,
      required: true,
    },
    high: {
      type: Number,
      required: true,
    },
    low: {
      type: Number,
      required: true,
    },
    close: {
      type: Number,
      required: true,
    },
    volume: {
      type: Number,
      required: true,
    },
  });
};
// Get a collection for the stock symbol dynamically
const getStockModel = (symbol) => {
  const collectionName = symbol.toLowerCase(); // Use symbol name as collection name
  // Check if the model already exists
  if (mongoose.models[collectionName]) {
    return mongoose.models[collectionName]; // Return existing model
  }
  const stockSchema = createStockSchema();
  return mongoose.model(collectionName, stockSchema);
};

module.exports = getStockModel;
