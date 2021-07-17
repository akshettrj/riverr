const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Job"
    },
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    sop: {
        type: String,
        required: [true, "Please fill your SOP"],
        validate: {
            validator: function (v) {
                v = v.replace(/(^\s*)|(\s*$)/gi, "");
                v = v.replace(/[ ]{2,}/gi, " ");
                v = v.replace(/\n /, "\n");
                const textWords = v.split(" ");
                return textWords.length <= 250;
            },
            message: "The SOP exceeds the limit",
        }
    },
    status:{
        // 0 - Applied
        // 1 - Short Listed
        // 2 - Accepted
        // 3 - Rejected
        type: Number,
        required: true,
        default: 0,
        enum: [0,1,2,3]
    },
    dateOfApplication: {
        type: Date,
        required: true,
        default: new Date()
    },
    dateOfAcceptance: {
        type: Date,
        required: true,
        default: new Date()
    },
    jobRated: {
        type: Boolean,
        required: true,
        default: false
    },
    employeeRated: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model("Application", applicationSchema);