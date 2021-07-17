const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	fName: {
		type: String,
		required: [true, "First Name not provided"],
	},
	lName: {
		type: String,
		required: [true, "Last Name not provided"],
	},
	email: {
		type: String,
		required: [true, "Email Address not provided"],
		unique: [true, "Email Address already registered"],
		validate: {
			validator: function (v) {
				const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return emailRegExp.test(v);
			},
			message: "Email provided is not valid",
		},
	},
	isRecruiter: {
		type: Boolean,
		required: [true, "User type not provided"],
	},
	profileCompleted: {
		type: Boolean,
		required: true,
		default: false
	},
	password: {
		required: [true, "Please provide a password"],
		type: String
	},
	date: {
		type: Date,
		required: true,
		default: new Date()
	}
});

module.exports = mongoose.model("User", userSchema);
