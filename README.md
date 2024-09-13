# Server

run the following cmd:

```
cd server
npm i
node app.js
export MONGO_URI=mongodb+srv://this_is_mjk:Manas@iitkanpur.vmjoa.mongodb.net/myDB
// this role is the editer and viewer role
```

this will start the server

## Server components

### Worker

1. It runs in the interval of 1m, fetches data from `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}` -- found from `https://stackoverflow.com/a/46319960/23078987`
2. First fetches data with the help of `fetchStockData(symbol, interval, range)` function
3. Followed by `saveStockData(symbol, stockData)` which saves the data in the document of respective folder in the database.
4. The worker takes care of only adding the entries whihc are recently added, it dont addes again if the entry exist also it dicards entries with the null values.

### API end points

#### Fetch Stock Data for a Specific Day and stock

1. Endpoint: GET /stock/:symbol/:date
2. Params:

```
symbol: Stock symbol (e.g., lauruslabs.ns)
date: Date in YYYY-MM-DD format (e.g., 2024-09-13)
```

3. Example Request:

```
GET /stock/lauruslabs.ns/2024-09-13
Response:
Returns stock data for the specified day.
```

#### Fetch Latest Stock Data Entry

1. Endpoint: GET `/stock/:symbol`

2. Params:
   `symbol: Stock symbol (e.g., lauruslabs.ns)`
3. Example Request:
   ```
   GET /stock/lauruslabs.ns
   Response:
   Returns the latest stock data entry for the specified symbol.
   ```

#### Fetch All Stock Data

1. Endpoint: GET `/stocks`

2. Example Request:
   ```
   GET /stocks
   Response:
   Returns all stock data available in the database, grouped by stock symbol.
   ```

#### Error Handling

```
404 Not Found: If no data is found for a request.
500 Internal Server Error: For unexpected server errors.
```

# Frontend

run
`npm start`

Runs the app in the development mode.
