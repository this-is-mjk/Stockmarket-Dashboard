const mongoose = require("mongoose");

connectDB = async () => {
  try {
    // RUN: export MONGO_URI=mongodb+srv://this_is_mjk:Manas@iitkanpur.vmjoa.mongodb.net/myDB
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    // FIXME: not to exit the process
    process.exit(1);
  }
};

module.exports = connectDB;
