const express = require('express');
const app = express();
const path = require('path');

const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 8000;
const kafka = require('kafka-node');

app.get('/', (req, res) => {
 res.sendFile(path.join(__dirname,'src/index.html'));
});

io.on('connection', socket => {
    console.log('user connected');

    socket.on('disconnect', () => {
        console.log('A user disconnect');
    })

    socket.on('saran',msg => {
        console.log('client message '+ msg);
    })
})


const user = new kafka.KafkaClient({
    kafkaHost: 'localhost:9092',
  });
  
  const producer = new kafka.Producer(user);
  
  producer.on('ready', () => {
    const payload = [
      {
        
        topic: 'kani',
        messages: 'Hello!'
      }
    ];
  
    producer.send(payload, (error, data) => {
      if (error) {
        console.error('Error in publishing message:', error);
      } else {
        console.log('Message successfully published:', data);
      }
    });
  });
  
  producer.on('error', (error) => {
    console.error('Error connecting to Kafka:', error);
  });

http.listen(port, () => {
console.log('Server engine started');
});