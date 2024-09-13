const getStockModel = require("../database/models/stockData");

// Fetch individual stock’s latest data entry
const fetchLatestStockData = async (req, res) => {
  try {
    const { symbol } = req.params;
    const StockModel = getStockModel(symbol);

    const latestData = await StockModel.findOne()
      .sort({ timestamp: -1 })
      .exec();
    console.log(latestData);
    if (!latestData) return res.status(404).json({ message: "No data found" });

    res.json(latestData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = fetchLatestStockData;
