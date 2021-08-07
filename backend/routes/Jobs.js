const express = require("express");
const router = express.Router();
const User = require("../models/User");
const ApplicantProfile = require("../models/ApplicantProfile");
const RecruiterProfile = require("../models/RecruiterProfile");
const Job = require("../models/Job");
const Application = require("../models/Application");
const nodemailer = require("nodemailer");

// GET request
// Just a test API to check if server is working properly or not
router.get("/", function (req, res) {
	const profile = JSON.parse(req.query.profile);
	User.findOne({
		email: profile.email,
		password: profile.hash
	}).then(user => {
		ApplicantProfile.findOne({userID: user._id})
			.then(userProfile => {
				const userSkills = userProfile.skills.map(skill => skill.toLowerCase());
				Job.find({})
					.populate("creatorId")
					.exec()
					.then(jobs => {
						const filteredJobs = [];
						function sendJobs(){
							setTimeout(() => {
								res.status(200).json({jobs: filteredJobs});
							}, 2000);
						}
						if(jobs.length === 0) sendJobs();
						else {
							jobs.forEach((job, indx, arr) => {
								Application.find({jobId: job._id})
									.populate("applicantId").exec()
									.then(applications => {
										if (new Date(job.deadline).getTime() > new Date().getTime()) {
											var skillsFullfilled = true;
											job.requiredSkills.forEach(reqSkill => {
												if (userSkills.findIndex(userSkill => userSkill === reqSkill.toLowerCase()) === -1)
													skillsFullfilled = false;
											})
											if (
												skillsFullfilled
												&& applications.findIndex(application => {
													return application.applicantId.email === profile.email
														&& application.status === 2
												}) === -1
											) {
												filteredJobs.push({
													jobId: job._id,
													title: job.title,
													recruiterName: (job.creatorId.fName + " " + job.creatorId.lName),
													rating: job.rating,
													monthlySalary: job.monthlySalary,
													durationInMonths: job.durationInMonths,
													deadline: job.deadline,
													seatsLeft: job.positionsAvailable - job.acceptedApplications,
													alreadyApplied: (applications.findIndex(application => application.applicantId.email === profile.email) !== -1),
													applicationsLeft: job.maxApplications - applications.length,
													typeOfJob: job.typeOfJob
												})
											}
										}
										if (indx === arr.length - 1) sendJobs();
									}).catch(err => {
									res.status(400).send("Could not retrieve applications.")
								})
							});
						}
					}).catch(err => { res.status(400).send("Could not retrieve jobs.") });
			}).catch(err => {console.log(err);res.status(400).send("Could not retrieve your profile")});
	}).catch(err => {console.log(err);res.status(400).send("User Not found or is unauthenticated")})
});

router.post("/", function (req, res) {
	const {profile, details} = req.body;
	const jobType = (details.typeOfJob === "workFromHome" ? 0 : (details.typeOfJob === "partTime" ? 1 : 2));
	User.findOne({
		email: profile.email,
		password: profile.hash
	}).then((user) => {
		const newJob = new Job({
			creatorId: user._id,
			title: details.title,
			deadline: details.deadline,
			maxApplications: details.maxApplications,
			positionsAvailable: details.positionsAvailable,
			durationInMonths: details.durationInMonths,
			monthlySalary: details.monthlySalary,
			typeOfJob: jobType,
			requiredSkills: details.requiredSkills
		});
		newJob.save()
			.then(response => {
				res.status(200).json({message: "Success"});
			})
			.catch(err => {
				res.status(400).json({message: "Failure"});
			});
	}).catch(err => {
		res.status(400).json({message: "Not able to find user"});
	});
});

router.get("/myJobs", (req, res) => {
	const profile = JSON.parse(req.query.profile);
	User.findOne({
		email: profile.email,
		password: profile.hash
	}).then(user => {
		Job.find({
			creatorId: user._id
		}).then(jobs => {
			var finalActiveJobs = [];
			function sendJobs() {
				setTimeout(() => {
					res.status(200).json({activeJobs: finalActiveJobs});
				}, 2000);
			}
			if(jobs.length === 0) sendJobs();
			else {
				jobs.forEach((activeJob, indx, arr) => {
					Application.find({jobId: activeJob._id})
						.then(applications => {
							finalActiveJobs.push({
								jobId: activeJob._id,
								title: activeJob.title,
								dateCreated: activeJob.dateCreated,
								positionsLeft: activeJob.positionsAvailable - activeJob.acceptedApplications,
								applicantCount: applications.length,
								maxApplications: activeJob.maxApplications,
								positionsAvailable: activeJob.positionsAvailable,
								acceptedApplications: activeJob.acceptedApplications,
								deadline: activeJob.deadline,
							})
							if(indx === arr.length - 1){
								sendJobs();
							}
						})
						.catch(err => {res.status(400).send("Fail")})
				});
			}
		}).catch(err => {
			console.log(err);
			res.status(400).send("Fail1");
		});
	}).catch(err => {
		res.status(400).send("Fail");
	});
});

router.get("/myActiveJobs", (req, res) => {
	const profile = JSON.parse(req.query.profile);
	User.findOne({
		email: profile.email,
		password: profile.hash
	}).then(user => {
		Job.find({
			creatorId: user._id
		}).then(jobs => {
			let activeJobs = jobs.filter((job) => {
				return job.acceptedApplications < job.positionsAvailable;
			});
			const finalActiveJobs = [];
			function sendJobs() {
				setTimeout(() => {
					res.status(200).json({activeJobs: finalActiveJobs});
				}, 2000);
			}
			if(activeJobs.length === 0) sendJobs();
			else {
				activeJobs.forEach((activeJob, indx, arr) => {
					Application.find({jobId: activeJob._id})
						.then(applications => {
							finalActiveJobs.push({
								jobId: activeJob._id,
								title: activeJob.title,
								dateCreated: activeJob.dateCreated,
								positionsLeft: activeJob.positionsAvailable - activeJob.acceptedApplications,
								applicantCount: applications.length,
								maxApplications: activeJob.maxApplications,
								positionsAvailable: activeJob.positionsAvailable,
								acceptedApplications: activeJob.acceptedApplications,
								deadline: activeJob.deadline,
							})
							if(indx === arr.length - 1){
								sendJobs();
							}
						})
						.catch(err => {res.status(400).send("Fail")})
				});
			}
		}).catch(err => {
			console.log(err);
			res.status(400).send("Fail1");
		});
	}).catch(err => {
		res.status(400).send("Fail");
	});
});

router.delete("/myJob", (req, res) => {
	const {jobId} = req.query;
	const profile = JSON.parse(req.query.profile);
	User.findOne({email: profile.email, password: profile.hash})
		.then(user => {
			Job.deleteOne({_id: jobId, creatorId: user._id})
				.then(response => {
					Application.deleteMany({jobId: jobId})
						.then(response1 => {res.status(200).send("Success")}).catch(err => {res.status(400).send("Fail")});
				}).catch(err => {res.status(400).send("Fail")});
		}).catch(err => { console.log(err); res.status(400).send("Fail") });
});

router.patch("/myJob", (req, res) => {
	const {maxApplications, profile, positionsAvailable, deadline, jobId} = req.body;
	User.findOne({
		email: profile.email,
		password: profile.hash
	}).then(user => {
		Job.findOneAndUpdate({
			_id: jobId,
			creatorId: user._id
		}, {maxApplications, deadline, positionsAvailable}, {runValidators: true})
			.then(job => {res.status(200).send("Success")})
			.catch(err => {res.status(400).send("Fail")});
	}).catch(err => {
		res.status(400).send("Fail")
	})
});

router.post("/apply", (req, res) => {
	const {jobId, profile, sop} = req.body;
	User.findOne({email: profile.email, password: profile.hash})
		.then(user => {
			Job.findById(jobId)
				.then(job => {
					Application.find({jobId: job._id})
						.then(applications => {
							if(applications.length >= job.maxApplications || (new Date().getTime() > new Date(job.deadline).getTime())){
								res.status(400).send("Applications Full");
							}
							else {
								Application.find({applicantId: user._id, status: { $ne: 3 }})
									.then(userApplications => {
										if( userApplications.findIndex((usrApp) => (usrApp.status===2)) !== -1 ) {
											res.status(400).send("You are already accepted for a job");
										}
										if(userApplications.length < 10 && userApplications.findIndex((usrApp) => (usrApp.status===2)) === -1){
											const application = new Application({
												creatorId: job.creatorId,
												jobId: job._id,
												applicantId: user._id,
												sop: sop
											});
											application.save()
												.then(response => {
													res.status(200).send("Success");
												})
												.catch(err => {
													res.status(400).send("Could not create application");
												});
										}
										else res.status(400).send("You already have 10 applications open");
									})
									.catch(err => {});
							}
						})
						.catch(err => {
							res.status(400).send("Could not retrieve applications");
						});
				})
				.catch(err => {
					res.status(400).send("Job not found");
				});
		})
		.catch(err => {
			res.status(400).send("User not found");
		})
});

router.get("/applications", (req, res) => {
	const profile = JSON.parse(req.query.profile);
	User.findOne({email: profile.email, password: profile.hash})
		.then(user => {
			Application.find({applicantId: user._id})
				.populate("jobId")
				.populate("creatorId")
				.exec()
				.then(applications => {
					res.status(200).json({applications: applications});
				})
				.catch(err => {
					res.status(400).send("Could not retrieve applications")
				})
		})
		.catch(err => {
			res.status(400).send("Could not retrieve user")
		})
})

router.post("/rate", (req, res) => {
	const {jobId, applicationId, profile, jobRating} = req.body;
	User.findOne({
		email: profile.email,
		password: profile.hash
	}).then(user => {
		Application.findOne({
			_id: applicationId,
			applicantId: user._id
		}).then(application => {
			if(application.status !== 2){
				res.status(400).send("Your application has not been accepted");
			}
			else if(application.jobRated === true) {
				res.status(400).send("Already Rated");
			}
			else {
				Job.findById(application.jobId)
					.then(job => {
						if(job.countOfRatings === 0)
							job.rating = Number(jobRating);
						else{
							job.rating = (Number(jobRating) + (job.rating * job.countOfRatings))/(1 + job.countOfRatings)
						}
						job.countOfRatings = job.countOfRatings + 1;
						job.save()
							.then(response => {
								application.jobRated = true;
								application.save()
									.then(resp => {
										res.status(200).send("Success")
									}).catch(err => {
									res.status(400).send("Failed to record");
								})
							})
							.catch(err => {res.status(400).send("Could not save")});
					})
					.catch(err => {
						res.status(400).send("Job not found")
					})
			}
		}).catch(err => {
			res.status(400).send("Application not found");
		})
	}).catch(err => {
		res.status(400).send("User not found");
	})
})

router.get("/openApplications", (req, res) => {
	const {jobId} = req.query;
	const profile = JSON.parse(req.query.profile);
	User.findOne({
		email: profile.email,
		password: profile.hash
	}).then(user => {
		Application.find({
			jobId: jobId,
			creatorId: user._id,
			status: {
				$ne: 3
			}
		}).then(applications => {
				var finalApplications = [];
				function sendApplications(){
					setTimeout(() => {
						res.status(200).json({applications: finalApplications});
					}, 2000);
				}
				if(applications.lenght === 0) sendApplications();
				else {
				applications.forEach((application, indx, arr) => {
					ApplicantProfile.findOne({
						userID: application.applicantId
					}).populate("userID").exec()
						.then(applicant => {
							finalApplications.push({
								applicant: `${applicant.userID.fName} ${applicant.userID.lName}`,
								skills: applicant.skills,
								education: applicant.education,
								rating: applicant.rating,
								applicationId: application._id,
								sop: application.sop,
								status: application.status,
								dateOfApplication: application.dateOfApplication
							});
							if(indx === (arr.length - 1)){
								sendApplications();
							}
						})
						.catch(err => {
							res.status(400).send("Could not find applicant");
						})
				});
				}
		}).catch(err => {
			res.status(400).send("Could not retrieve applications");
		});
	}).catch(err => {
		res.status(400).send("User not authenticated");
	});
});

router.patch("/moveApplicationForward", (req,res) => {

	function sendConfirmation(applicant, recruiter, job){

		const durationString =
			job.durationInMonths === 0
				? "Indeterminate"
				: `${job.durationInMonths} month` + (job.durationInMonths === 1 ? "" : "s");

		const jobTypeString =
			job.jobType === 0
				? "W.F.H"
				: job.jobType === 1 ? "Part Time" : "Full Time"

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: require("../config/emailCredentials")
		});

		const mailOptions = {
			from: "jobsriverr@gmail.com",
			to:  applicant.email,
			subject: "Congratulations!! Job Application Accepted",
			text: `
			Dear ${applicant.fName},
					You have been selected for a job that you applied for under ${recruiter.fName}.
						Now you cannot apply for any more jobs now.

					Job Title: ${job.title}
					Salary: ₹${job.monthlySalary}/month
					Duration: ${durationString}
					Type: ${jobTypeString}

				Regards
				Riverr Team `
		}

		return transporter.sendMail(mailOptions)
	};

	const {profile, applicationId} = req.body;
	User.findOne({
		email: profile.email,
		password: profile.hash
	}).then(user => {
		Application.findById(applicationId)
			.populate("applicantId")
			.populate("creatorId")
			.populate("jobId")
			.exec()
			.then(application => {
				if(application.jobId.acceptedApplications === application.jobId.positionsAvailable) {
					res.status(400).send("All positions have been filled");
				}
				else if(application.status === 1) {
					application.status = application.status + 1;
					application.dateOfAcceptance = new Date();
					application.save().then(response2 => {
						Job.findById(application.jobId._id)
							.then(job => {
								if(job.acceptedApplications === (job.positionsAvailable - 1)){
									console.log("Aya");
									Application.updateMany({
										jobId: job._id,
										status: {$ne: 2}
									}, {
										$set: {"status": 3}
									}).then(response3 => {
										console.log("Aaaaaaya");
									}).catch(err => {

									});
								}
								job.acceptedApplications = job.acceptedApplications + 1;
								job.save().then(response1 => {
									Application.updateMany({
										applicantId: application.applicantId._id,
										jobId: {$ne: job._id}
									}, {
										$set: {"status": 3}
									}, {
										runValidators: true
									}).then(resp => {


									}).catch(err => {
										res.status(400).send("Failed to update");
									})

								}).catch(err => {
									res.status(400).send("Failed to update");
								})
							}).catch(err => {
							res.status(400).send("Some error");
						})
						sendConfirmation(application.applicantId, application.creatorId, application.jobId);
						res.status(200).send("Success")
					}) .catch(err => {
						res.status(400).send("Failed to update");
					});

				}
				else {
					application.status = 1;
					application.save().then(response => {
						res.status(200).send("Success");
					}).catch(err => {
						res.status(400).send("failed to update");
					})
				}
			})
			.catch(err => {
				res.status(400).send("Failed to find application");
			});
	}).catch(err => {
		res.status(400).send("Failed to authenticate user");
	})
});

router.patch("/reject", (req, res) => {
	const {profile, applicationId} = req.body;
	User.findOne({
		email: profile.email,
		password: profile.hash
	}).then(user => {
		Application.findOneAndUpdate({
			_id: applicationId,
			creatorId: user._id
		}, {$set: {"status": 3}}, {runValidators: true}).then(response => {
			res.status(200).send("Success");
		}).catch(err => {
			res.status(400).send("Failure");
		})
	}).catch(err => {
		res.status(400).send("Failure");
	});
});

router.get("/employees", (req, res) => {
	const profile = JSON.parse(req.query.profile);
	User.findOne({
		email: profile.email,
		password: profile.hash
	}).then(user => {
		Application.find({
			creatorId: user._id,
			status: 2
		}).populate("applicantId")
			.populate("jobId")
			.exec()
			.then(applications => {
				var finalApplications = [];
				function sendApplications(){
					setTimeout(() => {
						res.status(200).json({applications: finalApplications});
					}, 2000)
				}
				if(applications.length === 0) sendApplications();
				else {
					applications.forEach((application, index, arr) => {
						ApplicantProfile.findOne({
							userID: application.applicantId._id
						}).then(applicantProfile => {
							finalApplications.push({
								applicationId: application._id,
								name: `${application.applicantId.fName} ${application.applicantId.lName}`,
								dateOfJoining: application.dateOfAcceptance,
								jobType: application.jobId.typeOfJob,
								jobTitle: application.jobId.title,
								userId: application.applicantId._id,
								rated: application.employeeRated,
								rating: applicantProfile.rating
							})
							if(index === arr.length - 1) sendApplications();
						}).catch(err => {res.status(400).send("Could not find user profiles")});
					});
				}
		}).catch(err => {
			res.status(400).send("Employees could not be recovered");
		});
	}).catch(err => {
		res.status(400).send("User not authenticated");
	});
});

module.exports = router;
