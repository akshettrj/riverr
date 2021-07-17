let express = require("express");
let md5 = require("md5");
let router = express.Router();

// Load User model
const User = require("../models/User");
const ApplicantProfile = require("../models/ApplicantProfile");
const RecruiterProfile = require("../models/RecruiterProfile");
const Application = require("../models/Application");


// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

// POST request 
// Add a user to db
router.post("/register", (req, res) => {
    User.findOne({email: req.body.email}).then(user => {
        if(user) {
            res.status(400).send("The email address is already taken");
        }
        else{
            const isRecruiter = req.body.userType !== "applicant";
            const currentTime = new Date();
            const newUser = new User({
                fName: req.body.fName,
                lName: req.body.lName,
                email: req.body.email,
                password: md5(req.body.password),
                isRecruiter: isRecruiter,
            });

            newUser.save()
                .then(user => {
                    const {fName, lName, email, date, password, profileCompleted} = user;
                    res.status(200).json({
                        profile: {
                            fName: fName,
                            lName: lName,
                            email: email,
                            dateJoined: date,
                            hash: password,
                            isRecruiter: isRecruiter,
                            profileCompleted: profileCompleted
                        }
                    });
                })
                .catch(err => {
                    res.status(400).send("Failed");
                });
        }
    }).catch(err => {
        res.status(400).send("Failed");
    })
});

// POST request
// Login
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let missingDetailErrorMessage = "";
    let missingData = false;
    if(email === "") {
        missingDetailErrorMessage += "* Please provide an Email ID";
        missingData = true;
    }
    if(password === "") {
        missingDetailErrorMessage += "* Please provide a password";
        missingData = true;
    }

    if(missingData){
        res.status(400).json({
            successful: false,
            message: missingDetailErrorMessage
        });
    }
    else {
        const passwordHash = md5(password);
        const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const validEmail = emailRegExp.test(email);
        if(validEmail === false) {
            res.status(400).json({
                successful: false,
                message: "* Email Id not valid."
            });
        }
        else {
            // Find user by email
            User.findOne({ email: email }).then((user) => {
                // Check if user email exists
                if (!user) {
                    return res.status(404).json({
                        successful: false,
                        message: "* No account under this EmailId"
                    });
                }
                else if(user.password === passwordHash){
                    res.status(202).json({
                        successful: true,
                        message: "Successfully logged in.",
                        fName: user.fName,
                        lName: user.lName,
                        dateJoined: user.date,
                        email: user.email,
                        isRecruiter: user.isRecruiter,
                        hash: user.password,
                        profileCompleted: user.profileCompleted
                    });
                }
                else {
                    res.status(401).json({
                        successful: false,
                        message: "* Password not correct"
                    })
                }
            });
        }
    }
});

router.patch("/profile", (req, res) => {
    const {profile} = req.body;
    User.findOne({
        email: profile.email
    }).then(user => {
        if(user.password !== profile.hash){
            res.status(401).json({
                message: "Password not correct"
            });
        }
        else {
            if(profile.isRecruiter === true) {
                const {bio, contactNumber} = req.body;
                const newRecruiterProfile = new RecruiterProfile({
                    userID: user._id,
                    bio: bio,
                    contactNumber: contactNumber
                });
                newRecruiterProfile.save()
                    .then(response => {
                        user.profileCompleted = true;
                        user.save()
                            .then(userSaveResponse => {
                                res.status(200).json({ message: "Profile Completed" })
                            })
                            .catch(err => {res.status(400).json(err)});
                    })
                    .catch(err => {
                        res.status(400).json(err);
                    });
            }
            else {
                const {skills, educations} = req.body;
                const newApplicantProfile = new ApplicantProfile({
                    userID: user._id,
                    skills: skills,
                    education: educations
                });
                newApplicantProfile.save()
                    .then(response => {
                        user.profileCompleted = true;
                        user.save()
                            .then(userSaveResponse => {
                                res.status(200).json({ message: "Profile Completed" })
                            })
                            .catch(err => {res.status(400).json(err)});
                    })
                    .catch(err => {
                        res.status(400).json(err);
                    });
            }
        }
    }).catch(err => {
        res.status(400).json({message: "User not found"});
    });
});

router.get("/applicant/profile", (req, res) =>{
    const {email} = req.query;
    User.findOne({ email: email })
        .then(user => {
            const userID = user._id;
            ApplicantProfile.findOne({userID: userID})
                .then(profile => {
                    res.status(200).json({
                        educations: profile.education,
                        skills: profile.skills,
                        rating: profile.rating
                    });
                })
                .catch(err => {
                    res.status(404).json({message: "Failed to find profile"})
                });
        })
        .catch(err => {
            res.status(400).json({message: "No such user found"});
        });
});

router.patch("/applicant/education", (req, res) => {
    const {profile, educations} = req.body;
    User.findOne({email: profile.email, password: profile.hash})
        .then(user => {
            ApplicantProfile.findOneAndUpdate({
                userID: user._id
            }, {
                education: educations
            }, {
                runValidators: true
            }).then(response => {
                res.status(200).json({message: "Success"});
            }).catch(err => {
                res.status(400).json({message: "Failed"})
            });
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

router.patch("/applicant/skills", (req, res) => {
    const {profile, skills} = req.body;
    User.findOne({email: profile.email, password: profile.hash})
        .then(user => {
            ApplicantProfile.findOneAndUpdate({
                userID: user._id
            }, {
                skills: skills
            }, {
                runValidators: true
            }).then(response => {
                res.status(200).json({message: "Success"});
            }).catch(err => {
                res.status(400).json({message: "Failed"})
            });
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

router.patch("/name", (req, res) => {
    const {profile, fName, lName} = req.body;
    User.findOneAndUpdate({email: profile.email, password: profile.hash},
        {fName: fName, lName: lName},
        {runValidators: true})
        .then(response => {
            res.status(200).json({message: "Success"});
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

router.patch("/email", (req, res) => {
    const {profile, email} = req.body;
    User.findOneAndUpdate({email: profile.email, password: profile.hash},
        {email: email},
        {runValidators: true})
        .then(response => {
            res.status(200).json({message: "Success"});
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

router.patch("/recruiter/bio", (req, res) => {
    const {profile, bio} = req.body;
    User.findOne({email: profile.email, password: profile.hash})
        .then(user => {
            RecruiterProfile.findOneAndUpdate({
                userID: user._id
            }, {
                bio: bio
            }, {
                runValidators: true
            }).then(response => {
                res.status(200).json({message: "Success"});
            }).catch(err => {
                res.status(400).json({message: "Failed"})
            });
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

router.patch("/recruiter/contactNumber", (req, res) => {
    const {profile, contactNumber} = req.body;
    User.findOne({email: profile.email, password: profile.hash})
        .then(user => {
            RecruiterProfile.findOneAndUpdate({
                userID: user._id
            }, {
                contactNumber: contactNumber
            }, {
                runValidators: true
            }).then(response => {
                res.status(200).json({message: "Success"});
            }).catch(err => {
                res.status(400).json({message: "Failed"})
            });
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

router.get("/recruiter/profile", (req, res) =>{
    const {email} = req.query;
    User.findOne({ email: email })
        .then(user => {
            const userID = user._id;
            RecruiterProfile.findOne({userID: userID})
                .then(profile => {
                    res.status(200).json({
                        bio: profile.bio,
                        contactNumber: profile.contactNumber
                    });
                })
                .catch(err => {
                    res.status(404).json({message: "Failed to find profile"})
                });
        })
        .catch(err => {
            res.status(400).json({message: "No such user found"});
        });
});

router.patch("/rate", (req, res) => {
    const {profile, applicationId, rating} = req.body;
    User.findOne({
        email: profile.email,
        password: profile.hash
    }).then(user => {
        Application.findById(applicationId)
            .then(application => {
                if(application.employeeRated === true) {
                    res.status(400).send("Already Rated by You");
                }
                else {
                    ApplicantProfile.findOne({userID: application.applicantId})
                        .then(applicant => {
                            applicant.rating = ( (applicant.rating * applicant.ratingCount) + Number(rating) ) / (applicant.ratingCount + 1)
	                        applicant.ratingCount = applicant.ratingCount + 1;
                            applicant.save().then(response => {
                                application.employeeRated = true;
                                application.save().then(resp => {
                                    res.status(200).send("Success");
                                }).catch(err => {
                                    res.status(400).send("Could not update application");
                                });
                            }).catch(err => {
                                res.status(400).send("Could not update rating");
                            });
                        })
                        .catch(err => {
                            res.status(400).send("Could not find User");
                        })
                }
            })
    }).catch(err => {

    });
});

module.exports = router;
