var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "",
		pass: ""
	}
});

var mailOptions = {
	from: "Riverr",
	to: "",
	subject: "",
	text: "Whats up!"
}

transporter.sendMail(mailOptions, (err, info) => {
	if(err) {
		console.log(err);
	} else {
		console.log("email sent");
	}
})
