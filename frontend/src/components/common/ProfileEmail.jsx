import React, {useState} from "react";
import {Grid, TextField, Button} from "@material-ui/core";
import axios from "axios";
import ProfileHeader from "./ProfileHeader";

function ProfileEmail(props) {

    const {profile, setProfile} = props;
    const [editMode, setEditMode] = useState(false);
    const [email, setEmail] = useState(profile.email);

    function handleEmailChange(event) {
        const {value} = event.target;
        setEmail(value);
    };

    function handleEmailSave(event){
        axios.patch("http://localhost:4000/user/email", {
        	email: email,
            profile: profile
        }).then(res => {
            setProfile(oldProfile => ({...oldProfile, email: email}));
            setEditMode(false);
        }).catch(err => {
        });
    };

    function handleCancelEdit() {
    	setEmail(profile.email);
        setEditMode(false);
    };

    return(
        <div style={{textAlign: "center", alignItems: "center", paddingTop: "2rem"}}>
            <Grid container spacing={3} style={{width: "40%", textAlign: "center", margin: "auto", padding: "auto auto"}} >
	            <ProfileHeader size={12} header={"Email"} />
                <Grid item xs={8} >
                    <TextField
                        variant={editMode ? "outlined" : "standard"}
                        value={email}
                        fullWidth
                        type={"email"}
                        name="fName"
                        onChange={editMode ? handleEmailChange : null}
                    />
                </Grid>
                <Grid item xs={2} style={{margin: "auto"}}>
                    {
                        editMode
                            ? <Button
                                variant="contained"
                                color="primary"
                                style={{width: "80%"}}
                                onClick={handleCancelEdit}
                            >Cancel</Button>
                            : <Button
                                variant="contained"
                                color="primary"
                                style={{width: "80%"}}
                                onClick={(e) => {
                                    setEditMode(true)
                                }}
                            >Edit</Button>
                    }
                </Grid>
                <Grid item xs={2} style={{margin: "auto"}}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{width: "80%"}}
                        disabled={!editMode}
                        onClick={handleEmailSave}
                    >Save</Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default ProfileEmail;
