import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";

function AddBio(props) {

  const { bio, setBio } = props;

  function getCountOfWords(text) {
    text = text.replace(/(^\s*)|(\s*$)/gi, "");
    text = text.replace(/[ ]{2,}/gi, " ");
    text = text.replace(/\n /, "\n");
    const textWords = text.split(" ");
    return textWords.length;
  }

  const [bioWordsUsed, setBioWordsUsed] = useState(0);

  function handleBioInputChange(event) {
    const { value } = event.target;
    const newWordCount = getCountOfWords(value);
    if (newWordCount <= 250) {
      setBio(value);
    }
  }

  useEffect(() => {  setBioWordsUsed(getCountOfWords(bio));  },[bio]);

  return (
    <div>
      <h3 style={{ marginBottom: "2rem" }}>Add something to your Bio</h3>
      <TextField
        style={{ width: "40%" }}
        name="bio"
        label="Add something to your Bio"
        multiline
        rows={6}
        defaultValue=""
        variant="outlined"
        value={bio}
        onChange={handleBioInputChange}
        helperText={
          (bio === "" ? 250 : 250 - bioWordsUsed).toString() + " words left"
        }
      />
    </div>
  );
}

export default AddBio;
