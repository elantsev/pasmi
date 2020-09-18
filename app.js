const express = require('express')
const axios = require('axios');
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 5501
app.use(bodyParser.json())
app.use(cors())
const API_KEY = "34370821616d33b52a5834528b74f6435f476ec2ee044acf1ae3e1a58611"
const API_TEMPLATE_ID = "???????????????????????????????????"


app.post('/api', (req, res) => {
    const { API_USER_ID,...data} = req.body;
    res.sendStatus(200);
    axios.post("http://api.frml.st/api/v1/results/1", {
        headers: { API_KEY, API_TEMPLATE_ID, API_USER_ID},
        data
    })
});

app.get('/api', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.send('Hello World!')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
