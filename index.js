require('dotenv').config();
const cors = require("cors");
const express = require('express');
const Database = require('./db/DataBase'); 
const bodyParser = require('body-parser')
const app = express();
const userRouter = require('./routers/userRouter');
const productRouter = require('./routers/productRouter');

const PORT = process.env.PORT;

app.use(cors());

Database();

app.get("/", async (req, res) => { 
    res.send('SERVER IS RUNNING!!!');
});

app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', extended: true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()).use(bodyParser.json());

app.use(userRouter);
app.use(productRouter);

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
