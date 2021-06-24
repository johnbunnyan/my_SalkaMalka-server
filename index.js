const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const logger = require('morgan');

const app = express()
const port = process.env.PORT || 5000;



const mainRouter = require('./routes/main');
require("dotenv").config();

app.use(express.json()); //req.body 접근하게 해주는 미들웨어
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  //origin: 'http://localhost:3000',
  methods: ['GET, POST, OPTIONS, PUT'],
  credentials: true
}));



mongoose.connect(process.env.SRV,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connected to MongoDB")
}).catch((err)=>{
    console.log(err)
})

app.use('/', mainRouter);




app.listen(port, ()=>{
    console.log(`Server is running on port ${port}🚀`)
})