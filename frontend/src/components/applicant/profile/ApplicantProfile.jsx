import React, {useEffect, useState} from "react";
import AppNavbar from "../../common/AppNavbar";
import ProfileName from "../../common/ProfileName";
import axios from "axios";
import ProfileRating from "./ProfileRating";
import ProfileEducation from "./ProfileEducation";
import ProfileSkills from "./ProfileSkills";
import ProfileEmail from "../../common/ProfileEmail";
import ProfileDate from "./ProfileDate";
import ProfileType from "../../common/ProfileType";

function ApplicantProfile(props) {

	const { profile, setProfile } = props;

	const [rating, setRating] = useState(0);
	const [educations, setEducations] = useState([]);
	const [skills, setSkills] = useState([]);

	useEffect(() => {
		async function fetchData(){
			axios.get("http://localhost:4000/user/applicant/profile", {
				params: {
					email: profile.email
				}
			}).then(res => {
				const {educations: gotEducations, skills: gotSkills, rating: gotRating} = res.data;
				setRating(gotRating);
				setEducations(gotEducations);
				setSkills(gotSkills);
			}).catch(err => {
				alert("Error");
			});
		};

		fetchData();

	}, [profile.email]);

	return (
		<div style={{paddingBottom: "4rem"}}>
            <AppNavbar {...props} />
			<ProfileName {...props} />
			<ProfileEmail profile={profile} setProfile={setProfile} />
			<ProfileType profile={profile} setProfile={setProfile} />
			<ProfileDate profile={profile} />
			<ProfileRating rating={rating} {...props} />
			<ProfileEducation educations={educations} setEducations={setEducations} {...props} />
			<ProfileSkills skills={skills} setSkills={setSkills} {...props} />
		</div>
	);
};

export default ApplicantProfile;
