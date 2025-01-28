const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const mongoUrl = process.env.MONGODB_URI;
const PORT = 8000;

const JWTSECRET =
	"gjjk6vyl0twtosl6945gr0fz()709hgtq1fc98fmu725k[]{}4xvjkx7pecvtgr94fazvyt6yaj2ycxb2w6dazos0othe24cz9mp3oo7qrm8gf4js73x3dt064wzvjt6kz03b51pckkmiybh9wte4x0zvpkxbid00c58bci3re4al5j2pezpcej8o8btwe78hs6f4tubx264id";

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
		const token = jwt.sign({ username: userExist.username }, JWTSECRET);

		if (res.status(200)) {
			return res.send({ status: "ok", data: "Login successful", token: token });
		}
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

app.post("/auth/verification", async (req, res) => {
	const { token } = req.body;

	try {
		const user = jwt.verify(token, JWTSECRET);
		const userUsername = user.username;

		user.findOne({ username: userUsername }).then((data) => {
			return res.send({ status: "ok", data: data });
		});
	} catch (error) {
		return res.send({ error: error });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT} `);
});
