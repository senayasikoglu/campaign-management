/**
 * Server Entry Point
 * Initializes App and starts listening on specified port
 */

require("dotenv").config();
const app = require("./app");
require("./db");
const channelCache = require("./utils/channelCache");

// Load channels once; cache is invalidated on channel CRUD operations.
channelCache.warm();

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

