const nodeCmd = require('node-cmd');
const express = require('express')
// const WebSocket = require('ws');
const path = require('path')
const axios = require('axios');
// const bodyParser = require('body-parser');


const app = express();
const port = 8000;
// const wsPort = 8001;

// const wss = new WebSocket.Server({ app, port: wsPort });

// async function runCommand(command) {
//     return new Promise((resolve, reject) => {
//         nodeCmd.run(command, (err, data, stderr) => resolve(data));
//     });
// }

// wss.on('connection', (ws) => {
//     ws.on('message', async (message) => {
//         try {
//             console.log(message);
//             // const response = await axios.post('localhost:11434/api/generate', {
//             //     "model": "llama3.2:1b",
//             //     "prompt": message,
//             // });
            
//             // curl http://localhost:11434/api/generate -d '{"model": "llama3.2","prompt": "Why is the sky blue?"}'
//             const processRef=nodeCmd.run(`
//                 curl http://localhost:11434/api/generate -d '{
//                     "model": "llama3.2:1b",
//                     "prompt": "${message}"
//                 }'`);
//             processRef.stdout.on('data', (data) => ws.send(data));

            
//         } catch (error) {
//             console.error('Error with Ollama API:', error);
//             ws.send('Error occurred while processing your request.');
//         }
//     });
// });

app.use(express.json())

app.post('/api/generate', async (req, res) => {
    const { prompt } =  req.body;
    console.log({body: req.body});
    const raw = await axios.post('http://localhost:11434/api/generate', {
        model: "llama3.2:1b",
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
    const data = await runCommand('dir');
    res.send(data);
});


app.use('/static', express.static(path.join(__dirname, 'public')))

app.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`);
});

