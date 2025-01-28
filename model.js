const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	firstName: { type: String },
	lastName: { type: String },
	address: { type: String },
});

mongoose.model("User", userSchema);
