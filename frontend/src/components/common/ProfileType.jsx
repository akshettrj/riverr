import React from "react";
import {Grid} from "@material-ui/core";
import ProfileHeader from "./ProfileHeader";

function ProfileType(props) {

    const {profile} = props;

    return(
        <div style={{textAlign: "center", alignItems: "center", paddingTop: "2rem"}}>
            <Grid container spacing={3} style={{width: "40%", textAlign: "center", margin: "auto", padding: "auto auto"}} >
	            <ProfileHeader size={8} header={"User Type"} />
                <Grid item xs={2} style={{margin: "auto"}}>
	                <h6>{profile.isRecruiter ? "Recruiter" : "Applicant"}</h6>
                </Grid>
            </Grid>
        </div>
    );
};

export default ProfileType;
