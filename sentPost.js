const axios = require('axios');
const port = 3000;

axios.post(`http://localhost:${port}/error`, {
    title: "Title",
    message: 'Message'
})