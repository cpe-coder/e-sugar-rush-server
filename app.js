const express = require("express");
const app = express();
const mongoose = require("mongoose");

require("dotenv").config();

const mongoUrl = process.env.MONGODB_URI;

mongoose
	.connect(mongoUrl)
	.then(() => {
		console.log("Connected to database");
	})
	.catch((err) => {
		console.log("Error connecting to database", err);
	});
require("./model");
const user = mongoose.model("User");

app.post("/login", async (req, res) => {
	const { username, password } = req.body;

	const userFound = await user.findOne({ username, password });

	if (
		!userFound &&
		!userFound.username === "owner" &&
		userFound.password === "owner"
	) {
		try {
			await user.create({ username: username, password: password });
			res.send({ status: "Ok", data: "Owner created" });
		} catch (error) {
			res.send({ status: "Error", error: error.message });
		}
	} else {
		res.send({ status: "Ok", data: "User logged in" });
	}

	try {
		await user.create({ username: username, password: password });
		res.send({ status: "Ok", data: "User created" });
	} catch (error) {
		res.send({ status: "Error", error: error.message });
	}
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
