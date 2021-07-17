import React from "react";
import {Grid} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import ProfileHeader from "../../common/ProfileHeader";

function ProfileRating (props) {

    const { rating } = props;

    return(
        <div style={{textAlign: "center", alignItems: "center", paddingTop: "2rem"}}>
            <Grid container spacing={3} style={{width: "40%", textAlign: "center", margin: "auto", padding: "auto auto"}} >
                <ProfileHeader size={6} header={"Rating"} />
                <Grid item xs={6} >
                    <Rating size={"large"} value={rating} precision={0.5} readOnly  />
                </Grid>
            </Grid>
        </div>
    );
};

export default ProfileRating;