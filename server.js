require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const port = process.env.PORT || 3000;

const server = app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Server running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("unhandled Rejection occur");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
