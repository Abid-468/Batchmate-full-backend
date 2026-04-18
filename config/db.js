const mongoose = require("mongoose");
const db = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      "Database Connected: ",
      connect.connection.host,
      connect.connection.name,
    );
    return connect;
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
};
module.exports = db;
