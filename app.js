const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./model");

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

app.post("/api/login", (req, res) => {
	const { username, password } = req.body;

	const findUser = User.findOne({ username, password })
		.then((user) => {
			if (user) {
				res.send("Login successful");
			} else {
				res.status(401).send("Invalid credentials");
			}
		})
		.catch((err) => {
			console.log("Error logging in", err);
			res.status(500).send("Internal server error");
		});

	if (findUser.length === 0) {
		User.create({ username, password })
			.then(() => {
				res.send("User created successfully");
			})
			.catch((err) => {
				console.log("Error creating user", err);
				res.status(500).send("Internal server error");
			});
	} else {
		findUser;
	}
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
