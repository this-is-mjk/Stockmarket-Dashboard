const getStockModel = require("../database/models/stockData");


const fetchStockDataForDay = async (req, res) => {
  try {
    const { symbol, date } = req.params;
    const StockModel = getStockModel(symbol);

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1); // Add 1 day to cover the full day

    const data = await StockModel.find({
      timestamp: { $gte: startDate, $lt: endDate },
    }).exec();

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = fetchStockDataForDay;
