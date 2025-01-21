const express = require("express");
const app = express();
const mongoose = require("mongoose");

const mongoUrl = process.env.MONGODB_URI;

mongoose
	.connect(mongoUrl)
	.then(() => {
		console.log("Connected to database");
	})
	.catch((err) => {
		console.log("Error connecting to database", err);
	});

app.get("/login", (req, res) => {
	res.send({ status: "ok", message: "Hello World!" });
	// make a login request from client using username and password if password and username is empty then create admin password and admin username
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
