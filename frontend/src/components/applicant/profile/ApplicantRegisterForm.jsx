import React, { useEffect, useState } from 'react'
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import axios from "axios";

function ApplicantRegisterForm(props) {

	const [languages, setLanguages] = useState([]);
	const [selectedLanguages, setSelectedLanguages] = useState(new Map());
	const [additionalLanguage, setAdditionalLanguage] = useState("");

	useEffect(() => {
		async function fetchData(){
			const req = await axios.get("http://localhost:4000/lang");
			setLanguages(req.data.languages);
		}
		fetchData();
	}, []);

	function handleCheckboxChange(event) {
		const toggledLanguage = event.target.value;
		if(selectedLanguages[toggledLanguage]){
			setSelectedLanguages(oldLanguages => {
				oldLanguages[toggledLanguage] = false;
				return oldLanguages;
			});
		}
		else {
			setSelectedLanguages(oldLanguages => {
				oldLanguages[toggledLanguage] = true;
				return oldLanguages;
			});
		}
	};

	function handleAdditionalLanguageChange(event){
		setAdditionalLanguage(event.target.value);
	};

	function handleAdditionalLanguageAddition(){
		setLanguages((oldLanguages) => {
			oldLanguages.push(additionalLanguage);
			return oldLanguages;
		});
		setAdditionalLanguage("");
	};

	return (
		<div className="ApplicantRegisterForm">
			<h3>Select the languages you know</h3>
			<ul style={{listStyleType: "none"}}>
				{languages.map((item, indx) => (
					<li key={indx}>
						<Checkbox
							id={indx.toString()}
							onChange={handleCheckboxChange}
							inputProps={{'aria-label': 'primary checkbox'}}
							value={item}
						/> {item}
					</li>
				))}
			</ul>
			<div className="AddLanguages" style={{display: "flex", justifyContent: "space-evenly"}}>
				<TextField value={additionalLanguage} label="Add more languages" onChange={handleAdditionalLanguageChange}/>
				<Button onClick={handleAdditionalLanguageAddition} color="primary" > Add </Button>
			</div>
		</div>
	)
}

export default ApplicantRegisterForm
