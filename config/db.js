const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const connectDB = asyncHandler(async () => {
    const connect = await mongoose.connect(process.env.MONGGODB_URI);
    console.log(`몽고DB 접속됨: ${connect.connection.host}`)
});

module.exports = connectDB;