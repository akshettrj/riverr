import React from "react";
import "./DisplayMessage.css"

function DisplayMessage(props) {
	return (
		<div className={"displayMessage " + (props.type === "error" ? "errorMessage" : "") + (props.type === "success" ? "successMessage" : "")}>
			{ props.type === "error" ? props.message.split("*").map((msg, indx) => (
				<p>{ indx === 0 ? null : msg}</p>
			)) : <p>{props.message}</p>}
		</div>
	);
};

export default DisplayMessage;
