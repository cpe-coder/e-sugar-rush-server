const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { download } = require("express/lib/response");

require("dotenv").config();

const mongoUrl = process.env.MONGODB_URI;
const PORT = 8000;

const JWTSECRET =
	"hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

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
			data: "User doesn't exist! Please to the admin",
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

app.post("/userdata", async (req, res) => {
	const { token } = req.body;

	console.log(token);
	try {
		const User = jwt.verify(token, JWTSECRET);
		const userName = User.username;
		user.findOne({ username: userName }).then((data) => {
			console.log("verify");
			return res.send({
				status: "Ok",
				data: data,
			});
		});
	} catch (error) {
		return res.send({ error: error });
	}
});

app.post("/update", async (req, res) => {
	const { username, firstName, lastName, address } = req.body;
	try {
		await user.updateOne(
			{ username: username },
			{
				$set: {
					username,
					firstName,
					lastName,
					address,
				},
			}
		);
		res.send({ status: "Ok", data: "Credentials Updated" });
	} catch (error) {
		return res.send({ error: error });
	}
});

app.get("/get-all-user", async (req, res) => {
	try {
		const data = await user.find({});
		res.send({ status: "Ok", data: data });
	} catch (error) {
		return res.send({ error: error });
	}
});

app.get("/api/download", (req, res) => {
	const filePath = "./e-sugar-rush.apk";
	res.download(filePath);
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT} `);
});
