// const ws = new WebSocket('ws://localhost:8001');

// ws.onmessage = function(event) {
//     console.log({event, data: event.data});
//     try {
//         const data = JSON.parse(event.data);
//         console.log({message: data.response});
//         appendMessage(data.response);
//         if (data.done) {
//             appendMessage('</br>--------------------------------</br>');
//         }
//     } catch (error) {
//         const context = event.data
//         console.log({context});
//     }
// };

// ws.onopen = function() {
//     console.log('WebSocket is open now');
//     ws.send('Hello, server!');
// };  
// ws.onerror = function(error) {
//     console.error('WebSocket error:', error);
// };

function fetchMessage(message) {
    return fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: message }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

function sendMessage() {
    console.log('send');
    appendMessage('</br>--------------------------------</br>');
    appendMessage('</br>you: ' + document.getElementById('message').value, '</br>');
    appendMessage('</br>Bot:</br>');
    // ws.send(document.getElementById('message').value);
    fetchMessage(document.getElementById('message').value).then(response => response.json()).then(data => {
        appendMessage(data.response);
    });
}

function appendMessage(message) {
    const messages = document.getElementById('messages');
    messages.innerHTML += `${message}`;
}


const startButton = document.getElementById('start');
const result = document.getElementById('result');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = function() {
    console.log('Voice recognition started. Try speaking into the microphone.');
};

recognition.onspeechend = function() {
    console.log('Voice recognition stopped.');
    recognition.stop();
};

recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    result.textContent = transcript;
};

startButton.addEventListener('click', () => {
    recognition.start();
});