import React, { useEffect, useState } from "react";
import {Grid, TextField, Button} from "@material-ui/core";
import axios from "axios";
import ProfileHeader from "../../common/ProfileHeader";

function ProfileBio(props) {

	const {profile} = props;

	const { bio, setBio } = props;
	const { bioBackup, setBioBackup } = props;

	function getCountOfWords(text) {
		text = text.replace(/(^\s*)|(\s*$)/gi, "");
		text = text.replace(/[ ]{2,}/gi, " ");
		text = text.replace(/\n /, "\n");
		const textWords = text.split(" ");
		return textWords.length;
	}

	const [bioWordsUsed, setBioWordsUsed] = useState(0);

	const [editMode, setEditMode] = useState(false);

	function handleBioInputChange(event) {
		const { value } = event.target;
		const newWordCount = getCountOfWords(value);
		if (newWordCount <= 250) {
			setBio(value);
		}
	}

	useEffect(() => {  setBioWordsUsed(getCountOfWords(bio));  },[bio]);

	function handleBioSave(){
		axios.patch("http://localhost:4000/user/recruiter/bio",{
			profile: profile,
			bio: bio
		}).then(res => {
			setBioBackup(bio);
			setEditMode(false);
		}).catch(err => {
			console.log(err);
		});
	};

	function handleCancelEdit(){
		setBio(bioBackup);
		setEditMode(false);
	};

	return (
		<div>
			<div style={{textAlign: "center", alignItems: "center", paddingTop: "2rem"}}>
				<Grid container spacing={3} style={{width: "40%", textAlign: "center", margin: "auto", padding: "auto auto"}} >
					<ProfileHeader size={8} header={"Bio"} />
					<Grid item xs={2} >
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
					<Grid item xs={2} >
						<Button
							variant="contained"
							color="primary"
							style={{width: "80%"}}
							disabled={!editMode}
							onClick={handleBioSave}
						>Save</Button>
					</Grid>
				</Grid>
			</div>
			<TextField
				style={{ width: "40%" }}
				name="bio"
				label={editMode ? "Update you bio" : ""}
				multiline
				rows={6}
				variant={editMode ? "outlined" : "filled"}
				value={bio}
				onChange={editMode ? handleBioInputChange : null}
				helperText={
					editMode
						? (bio === "" ? 250 : 250 - bioWordsUsed).toString() + " words left"
						: "total " + (bio === "" ? 0 : bioWordsUsed).toString() + " words"
				}
			/>
		</div>
	);
}

export default ProfileBio;
