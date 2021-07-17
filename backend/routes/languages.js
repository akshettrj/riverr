var express = require("express");
var router = express.Router();

const languages = ["C++", "C", "C#", "Java", "Javascript", "HTML", "Python", "GoLang", "Ruby", "R", "Bash", "Zsh", "Assembly", "PHP", "Ajax", "Kotlin"].sort()

// GET request 
router.get("/", function(req, res) {
	res.json({
        languages: languages
    });
});

module.exports = router;
