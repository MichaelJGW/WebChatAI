const nodeCmd = require('node-cmd');
const express = require('express')
const path = require('path')
const axios = require('axios');


const app = express();
const port = 8000;

app.use(express.json())

app.post('/api/generate', async (req, res) => {
    const { prompt } =  req.body;
    console.log({body: req.body});
    const raw = await axios.post('http://localhost:11434/api/generate', {
        model: "sunstoppers:latest",
        prompt
    });
    try{
        raw.data = raw.data.split('\n');
        const tokens = raw.data.map(res => {
            try{
                const token = JSON.parse(res);
                return token.response;
            } catch (e) {
                return res;
            }
        })
        res.send({
            response: tokens.join('')
        });
    } catch (e) {
        res.send({
            response: raw.data
        });
    }
});


app.get('/', async (req, res) => {
    res.redirect('/static/index.html');
});

app.use('/static', express.static(path.join(__dirname, 'public')))

app.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`);
});

