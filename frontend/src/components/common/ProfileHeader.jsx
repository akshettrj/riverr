import React from "react";
import {Grid} from "@material-ui/core";

function ProfileHeader(props){

	const {size, header} = props;

	return (
		<Grid item xs={size} >
			<u><h4 align={"left"} >{header}</h4></u>
		</Grid>
	);

};

export default ProfileHeader;