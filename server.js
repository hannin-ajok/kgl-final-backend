require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const DB_RETRY_MS = Number(process.env.DB_RETRY_MS || 5000);

// Keep trying DB connection in the background so deployment health checks can pass.
async function connectWithRetry() {
  try {
    await connectDB();
  } catch (err) {
    console.error(`Retrying DB connection in ${DB_RETRY_MS / 1000}s...`);
    setTimeout(connectWithRetry, DB_RETRY_MS);
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectWithRetry();
});
