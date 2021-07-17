const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type: String,
        required: [true, "Job title not provided"]
    },
    dateCreated: {
        type: Date,
        required: [true, ""],
        default: new Date()
    },
    deadline: {
        type: Date,
        required: [true, "Deadline for applications not set"]
    },
    maxApplications: {
        type: Number,
        required: [true, "Limit of applications not set"],
        min: [1, "Why bother creating a job when you don't want to have applicants"],
        validate: {
            validator: function (v) {
                return v % 1 === 0;
            },
            message: "Number of max applications is not an integer",
        }
    },
    positionsAvailable: {
        type: Number,
        min: [1, "There should be atleast one position"],
        required: [true, "Number of positions available not set"],
        validate: {
            validator: function (v) {
                return v % 1 === 0;
            },
            message: "Positions specified is not an integer",
        }
    },
    durationInMonths: {
        type: Number,
        min: [0, "Seriously? Give positive duration"],
        max: [6, "The duration of job should be at max 6 months"],
        validate: {
            validator: function (v) {
                return v % 1 === 0;
            },
            message: "Job duration is not an integer",
        }
    },
    monthlySalary: {
        type: Number,
        required: [true, "Salary not specified"],
        min: [1, "Come on man, no one does anything for free"],
        validate: {
            validator: function (v) {
                return v % 1 === 0;
            },
            message: "Salary should be an Integer",
        }
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    countOfRatings: {
        type: Number,
        required: true,
        default: 0
    },
    typeOfJob: {
        // Takes three values:
        // 0 - Work from Home
        // 1 - Part Time
        // 2 - Full time
        type: Number,
        required: [true, "Please provide a type of job"],
        enum: [[0, 1, 2], "The job type set is not valid"]
    },
    requiredSkills: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: "No skills specified"
        }
    },
    acceptedApplications: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model("Job", jobSchema);
