/**
 * Server Entry Point
 * Initializes Appand starts listening on specified port
 */

require("dotenv").config();
const app = require("./app");
require("./db");


// Sets the PORT for our app to have access to it. If no env has been set, hard coded to 5005
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

