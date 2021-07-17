const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
	userID: {
		unique: true,
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	education: {
		type: [
			{
				name: {
					type: String,
					required: true,
				},
				startYear: {
					type: Number,
					required: true,
					validate: {
						validator: function (v) {
							yearRegExp = /^[0-9]{4}$/;
							const currentYear = new Date().getFullYear();
							return v <= currentYear && yearRegExp.test(v);
						},
						message: "Start Year is not a valid year",
					}
				},
				endYear: {
					type: Number,
					required: false,
					validate: {
						validator: function (v) {
							yearRegExp = /^[0-9]{4}$/;
							const currentYear = new Date().getFullYear();
							return v <= currentYear && (yearRegExp.test(v) || v === 0);
						},
						message: "End Year is not a valid year",
					},
				},
			},
		],
		validate: {
			validator: function (v){
				return v.length !== 0;
			},
			message: "No education detail given"
		},
		required: true
	},
	skills: {
		type: [ String ],
		required: true,
		validate: {
			validator: function (v){
				return v.length !== 0;
			},
			message: "No Skills specified"
		}
	},
	rating: {
		required: true,
		type: Number,
		default: 0,
		min: 0,
		max: 5
	},
	ratingCount: {
		type: Number,
		default: 0,
		required: true,
		ratingCount: {
			type: Number,
			default: 0,
			required: true
		}
	}
});

module.exports = mongoose.model("Applicant", applicantSchema);
