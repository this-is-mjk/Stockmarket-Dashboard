const express = require("express");
const app = express();
const morgan = require("morgan");
// set up morgan middleware
app.use(morgan("tiny"));
// connect to DB
const connectDB = require("./database/connectDB");
connectDB();
// start the worker
Worker = require("./worker/fetchData");
Worker();

fetchAllStockData = require("./controllers/allData");
fetchLatestStockData = require("./controllers/latestStockData");
fetchStockDataForDay = require("./controllers/stockDataForDay");

// Route to fetch stock data for a specific day
// test request at  GET /stock/lauruslabs.ns/2024-09-13
app.get("/stock/:symbol/:date", fetchStockDataForDay);

// Route to fetch latest stock data entry
// test request at  GET /stock/lauruslabs.ns
app.get("/stock/:symbol", fetchLatestStockData);

// Route to fetch all stock data
// test request at  GET /stocks
app.get("/stocks", fetchAllStockData);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
