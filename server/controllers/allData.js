const mongoose = require("mongoose");
const getStockModel = require("../database/models/stockData");

// Fetch all stock data
const fetchAllStockData = async (req, res) => {
  try {
    // Fetch all stock collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    // Create an object to hold the results
    const stockData = {};

    // Process each collection
    for (const collection of collections) {
      const collectionName = collection.name;
      const StockModel = getStockModel(collectionName);

      // Fetch all documents for the collection
      const data = await StockModel.find().exec();

      // Add the data to the result object
      stockData[collectionName] = data;
    }

    // Return the result object
    res.json(stockData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = fetchAllStockData;
