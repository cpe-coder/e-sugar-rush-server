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
app.use(express.json());

app.post("/api/login", async (req, res) => {
	const { username, password } = req.body;

	const userExist = await user.findOne({
		username: username,
		password: password,
	});

	if (
		userExist &&
		username === userExist.username &&
		password === userExist.password
	) {
		res.send({ status: "ok", data: "Login successful" });
	} else {
		res.send({ status: "error", data: "Invalid username or password" });
	}

	// try {
	// 	await user.create({ username: username, password: password });
	// 	res.send({ status: "ok", data: "User created" });
	// } catch (error) {
	// 	res.send({ status: "error", data: error });
	// }
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
