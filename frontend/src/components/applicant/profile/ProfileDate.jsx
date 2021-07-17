import React from "react";
import {Grid} from "@material-ui/core";
import ProfileHeader from "../../common/ProfileHeader";

function ProfileDate(props) {

	const {profile} = props;

	const DoJ = new Date(profile.dateJoined);

	const dateDisplayed = `${DoJ.toLocaleDateString()} @ ${DoJ.toLocaleTimeString()}`

	return(
		<div style={{textAlign: "center", alignItems: "center", paddingTop: "2rem"}}>
			<Grid container spacing={3} style={{width: "40%", textAlign: "center", margin: "auto", padding: "auto auto"}} >
				<ProfileHeader size={6} header={"Joining Date"} />
				<Grid item xs={6} style={{margin: "auto"}} >
					<h5>{dateDisplayed}</h5>
				</Grid>
			</Grid>
		</div>
	);
};

export default ProfileDate;
