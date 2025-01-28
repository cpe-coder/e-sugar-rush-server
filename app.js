const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

require("dotenv").config();

const mongoUrl = process.env.MONGODB_URI;
const PORT = 8000;

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

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.post("/auth/login", async (req, res) => {
	const { username, password } = req.body;

	const userExist = await user.findOne({
		username: username,
	});

	if (!userExist) {
		return res.send({
			data: "User doesn't exist! Please ask the developer",
		});
	}

	if (await bcrypt.compare(password, userExist.password)) {
		res.send({ status: "ok", data: "Login successful" });
		console.log("success");
	} else {
		res.send({ status: "error", data: "Invalid username or password" });
		console.log("error");
	}

	// const encryptedPassword = await bcrypt.hash(password, 10);
	// try {
	// 	await user.create({
	// 		username: username,
	// 		password: encryptedPassword,
	// 		firstName: firstName,
	// 		lastName: lastName,
	// 		address: address,
	// 	});
	// 	res.send({ status: "ok", data: "User created" });
	// } catch (error) {
	// 	res.send({ status: "error", data: error });
	// }
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT} `);
});
