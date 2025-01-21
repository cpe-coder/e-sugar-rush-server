const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		username: String,
		password: { type: String, required: true },
	},
	{
		collection: "User",
	}
);

mongoose.model("User", userSchema);
