const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();

// middleware 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('brandShop server is running')
});

app.listen(port, () => {
    console.log(`brandShop server is running on port ${port}`);
});