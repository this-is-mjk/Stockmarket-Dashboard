// https://stackoverflow.com/a/46319960/23078987 resource for the endpoint of the yahoo finance api
// can try https://www.npmjs.com/package/yahoo-finance2 if this dont work

const axios = require("axios");
const cron = require("node-cron");
const getStockModel = require("../database/models/stockData");

const fetchStockData = async (symbol, interval, range) => {
  try {
    const res = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`
    );
    const OHLCVdata = res.data.chart.result[0].indicators.quote[0];
    // insert timestamp
    const timestamp = res.data.chart.result[0].timestamp;
    OHLCVdata.timestamp = timestamp;
    return OHLCVdata;
  } catch (error) {
    console.error(`Failed to fetch data for ${symbol}:`, error.message);
    return null;
  }
};

const saveStockData = async (symbol, stockData) => {
  // Model for stock symbol
  const StockModel = getStockModel(symbol);

  // Find the latest (max) timestamp in the collection
  const latestData = await StockModel.findOne().sort({ timestamp: -1 }).exec();
  const latestTimestamp = latestData ? latestData.timestamp : null;

  // Loop through the stock data arrays and insert new entries with higher timestamps
  let count = 0;

  for (let index = 0; index < stockData.timestamp.length; index++) {
    const time = stockData.timestamp[index];
    const currentTimestamp = new Date(time * 1000); // Convert to Date object

    // Check if any field is null or undefined
    const isValidEntry =
      stockData.open[index] != null &&
      stockData.high[index] != null &&
      stockData.low[index] != null &&
      stockData.close[index] != null &&
      stockData.volume[index] != null;

    if (!isValidEntry) {
      console.log(
        `Skipped entry at ${currentTimestamp} due to null values of ${symbol}`
      );
      continue; // Skip this entry
    }

    // Insert only if the current timestamp is greater than the latest in the DB
    if (!latestTimestamp || currentTimestamp > latestTimestamp) {
      try {
        const newStock = new StockModel({
          timestamp: currentTimestamp,
          open: stockData.open[index],
          high: stockData.high[index],
          low: stockData.low[index],
          close: stockData.close[index],
          volume: stockData.volume[index],
        });

        await newStock.save();
        count++;
      } catch (error) {
        console.error(
          `Failed to save entry at ${currentTimestamp}:`,
          error.message
        );
      }
    }
  }

  console.log(`Inserted ${count} new entries for ${symbol}`);
};

const worker = () => {
  // list of nifty 50 stocks
  const nifty50Stocks = [
    "ADANIGREEN.NS", // Adani Green Energy Ltd
    "ADANIPORTS.NS", // Adani Ports and SEZ Ltd
    "ASIANPAINT.NS", // Asian Paints Ltd
    "BAJFINANCE.NS", // Bajaj Finance Ltd
    "BAJAJFINSV.NS", // Bajaj Finserv Ltd
    "BHARTIARTL.NS", // Bharti Airtel Ltd
    "BPCL.NS", // Bharat Petroleum Corp Ltd
    "BRITANNIA.NS", // Britannia Industries Ltd
    "CIPLA.NS", // Cipla Ltd
    "COALINDIA.NS", // Coal India Ltd
    "DIVISLAB.NS", // Divi's Laboratories Ltd
    "DRREDDY.NS", // Dr. Reddy's Laboratories Ltd
    "EICHERMOT.NS", // Eicher Motors Ltd
    "GAIL.NS", // Gail (India) Ltd
    "GRASIM.NS", // Grasim Industries Ltd
    "HCLTECH.NS", // HCL Technologies Ltd
    "HDFCBANK.NS", // HDFC Bank Ltd
    "HDFCLIFE.NS", // HDFC Life Insurance Co Ltd
    "HEROMOTOCO.NS", // Hero MotoCorp Ltd
    "HINDALCO.NS", // Hindalco Industries Ltd
    "HINDUNILVR.NS", // Hindustan Unilever Ltd
    "ICICIBANK.NS", // ICICI Bank Ltd
    "ITC.NS", // ITC Ltd
    "INFY.NS", // Infosys Ltd
    "IOC.NS", // Indian Oil Corporation Ltd
    "INDUSINDBK.NS", // IndusInd Bank Ltd
    "KOTAKBANK.NS", // Kotak Mahindra Bank Ltd
    "LT.NS", // Larsen & Toubro Ltd
    "M&M.NS", // Mahindra & Mahindra Ltd
    "MARUTI.NS", // Maruti Suzuki India Ltd
    "NESTLEIND.NS", // Nestle India Ltd
    "NTPC.NS", // NTPC Ltd
    "ONGC.NS", // Oil and Natural Gas Corporation Ltd
    "POWERGRID.NS", // Power Grid Corporation of India Ltd
    "RELIANCE.NS", // Reliance Industries Ltd
    "SBILIFE.NS", // SBI Life Insurance Co Ltd
    "SBIN.NS", // State Bank of India
    "SUNPHARMA.NS", // Sun Pharmaceutical Industries Ltd
    "TATAMOTORS.NS", // Tata Motors Ltd
    "TATAPOWER.NS", // Tata Power Company Ltd
    "TATASTEEL.NS", // Tata Steel Ltd
    "TECHM.NS", // Tech Mahindra Ltd
    "TCS.NS", // Tata Consultancy Services Ltd
    "TITAN.NS", // Titan Company Ltd
    "ULTRACEMCO.NS", // UltraTech Cement Ltd
    "UPL.NS", // UPL Ltd
    "WIPRO.NS", // Wipro Ltd
    "YESBANK.NS", // YES Bank Ltd
  ];

  cron.schedule("* * * * *", () => {
    nifty50Stocks.forEach(async (symbol) => {
      try {
        console.log("Fetching data for", symbol);
        const stockData = await fetchStockData(symbol, "1m", "1d");
        if (!stockData) {
          return; // Skip this symbol
        }
        // save to database
        await saveStockData(symbol, stockData);
      } catch (error) {
        console.error(error);
      }
    });
    console.log(
      "Fetched and started saving stock data at",
      new Date().toLocaleTimeString()
    );
  });
};

module.exports = worker;
