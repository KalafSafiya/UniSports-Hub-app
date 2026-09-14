require("dotenv").config();
const app = require("./app");
const connectMongo = require("./config/mongo"); // your mongo connection function
const initMySQL = require("./config/initMySQL"); // optional if you still need MySQL
const syncModels = require("./config/syncModels");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');
    // Connect MongoDB
    await connectMongo();

    // Optional: init MySQL if needed
    await initMySQL();

    // Sync models
    await syncModels();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server startup error:", err);
    process.exit(1);
  }
})();
