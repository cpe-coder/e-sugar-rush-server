const express = require("express");
const app = express();

app.get("/login", (req, res) => {
	res.send({ status: "ok", message: "Hello World!" });
	// make a login request from client using username and password if password and username is empty then create admin password and admin username

	if (req.query.username === "admin" && req.query.password === "admin") {
		res.send({ status: "ok", message: "Hello World!" });
	} else if (req.query.username === "" && req.query.password === "") {
		res.send({
			status: "error",
			message: "Please enter username and password",
		});
	} else {
		res.send({ status: "error", message: "Incorrect username or password" });
	}
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
