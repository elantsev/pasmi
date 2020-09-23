const express = require('express')
const app = express()
const cors = require('cors')
// const fetch = require("node-fetch");
// const bodyParser = require('body-parser')
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
var multer = require('multer');

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storageConfig });

// for parsing application/json
app.use(express.json());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// for parsing multipart/form-data
app.use(upload.any());
app.use(express.static('public'));

const port = 5501
const API_KEY = "c74981855ad8681d0d86d1e91e00167939cb6694d2c422acd208a0072939"
const API_TEMPLATE_ID = "52"

app.post('/api', (req, res) => {
    console.log("req", req)
    // console.log(JSON.stringify(req.body))
    // console.log(req.body);
    // const { API_USER_ID, ...answers } = req.body;
    res.sendStatus(200);

    fetch(`https://api.frml.st/api/v1/results/${API_USER_ID}/check/ghost_user`, {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            API_KEY,
            API_TEMPLATE_ID 
        },
        body: JSON.stringify(answers)
    });
});

app.get('/api', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.send('Hello World!')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
