const express = require('express')
const axios = require('axios');
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 5501
app.use(bodyParser.json())
const API_KEY = "34370821616d33b52a5834528b74f6435f476ec2ee044acf1ae3e1a58611"
const API_TEMPLATE_ID = "???????????????????????????????????"


app.use(cors())

app.get('/api', (req, res) => {
    console.log('get/api');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.send('Hello World!')
})

app.post('/api', (req, res) => {
    console.log('post/api');
    const { API_USER_ID,...data} = req.body;
    console.log(data);
    res.sendStatus(200);
    axios.post("http://api.frml.st/api/v1/results/1", data, {
        headers: { API_KEY, API_TEMPLATE_ID, API_USER_ID: "API_USER_ID"}
    })

    // makePostRequest()
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})




async function makePostRequest () {

    let res = await axios.post('https://jsonplaceholder.typicode.com/posts');

    console.log(`Status code: ${res.status}`);
    console.log(`Status text: ${res.statusText}`);
    console.log(`Request method: ${res.request.method}`);
    console.log(`Path: ${res.request.path}`);

    console.log(`Date: ${res.headers.date}`);
    console.log(`Data: ${res.data}`);
}