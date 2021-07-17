const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const {URI: mongodbURI} = require('./config/key');

const PORT = 4000;
const app = express();

// Routes
const testAPIRouter = require("./routes/testAPI");
const UserRouter = require("./routes/Users");
const languagesRouter = require("./routes/languages");
const jobsRouter = require("./routes/Jobs");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connecting to MongoDB database
mongoose
    .connect(mongodbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {console.log("Connected to the MongoDB database")})
    .catch((err) => {console.log(err)});


// Setup API Endpoints
app.use("/testAPI", testAPIRouter);
app.use("/user", UserRouter);
app.use("/lang", languagesRouter);
app.use("/job", jobsRouter);

app.listen(PORT, function(){
    console.log(`Server started on localhost:${PORT}`);
});