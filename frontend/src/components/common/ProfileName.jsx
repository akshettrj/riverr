import React, {useState} from "react";
import {Grid, TextField, Button} from "@material-ui/core";
import axios from "axios";
import ProfileHeader from "./ProfileHeader";

function ProfileName(props) {

    const {profile, setProfile} = props;
    const [editMode, setEditMode] = useState(false);
    const [fName, setFName] = useState(profile.fName);
    const [lName, setLName] = useState(profile.lName);

    function handleNameChange(event) {
        const {name, value} = event.target;
        if(name === "fName"){
            setFName(value);
        }
        else if(name === "lName") {
            setLName(value);
        }
    };

    function handleNameSave(event){
        axios.patch("http://localhost:4000/user/name", {
            fName: fName,
            lName: lName,
            profile: profile
        }).then(res => {
            console.log(res);
            setProfile(oldProfile => ({...oldProfile, fName: fName, lName: lName}));
            setEditMode(false);
        }).catch(err => {
            console.log(err.response);
        });
    };

    function handleCancelEdit() {
        setFName(profile.fName);
        setLName(profile.lName);
        setEditMode(false);
    };

    return(
        <div style={{textAlign: "center", alignItems: "center", paddingTop: "2rem"}}>
            <Grid container spacing={3} style={{width: "40%", textAlign: "center", margin: "auto", padding: "auto auto"}} >
                <ProfileHeader size={12} header={"Name"} />
                <Grid item xs={4}>
                    <TextField
                        variant={editMode ? "outlined" : "standard"}
                        value={fName}
                        name="fName"
                        onChange={editMode ? handleNameChange : null}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        variant={editMode ? "outlined" : "standard"}
                        value={lName}
                        name="lName"
                        onChange={editMode ? handleNameChange : null}
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
                        onClick={handleNameSave}
                    >Save</Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default ProfileName;
