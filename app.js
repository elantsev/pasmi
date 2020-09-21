const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const fetch = require("node-fetch");
const port = 5501
app.use(bodyParser.json())
app.use(cors())
const API_KEY = "c74981855ad8681d0d86d1e91e00167939cb6694d2c422acd208a0072939"
const API_TEMPLATE_ID = "52"

app.post('/api', (req, res) => {
    const { API_USER_ID, ...answers } = req.body;
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
