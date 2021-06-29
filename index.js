const express = require("express");
const cors = require("cors");
const logger = require('morgan');
const mongoose = require("mongoose")

const mainController =require('./controllers/mainController');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

require("dotenv").config();
const User = require('./models/model');
const Post = require('./models/model');

const app = express();
const port = process.env.PORT || 5000;

const myLogger = function (req, res, next) {
    console.log(`request: ${req.method}, path: ${req.path}`); // 이 부분을 req, res 객체를 이용해 고치면, 여러분들은 모든 요청에 대한 로그를 찍을 수 있습니다.
    next();
  };
  
app.use(myLogger);
  

app.use(express.json()); //req.body 접근하게 해주는 미들웨어
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET, POST, OPTIONS, PATCH, DELETE'],
  credentials: true
}));

//console.log(process.env.SRV)
mongoose.connect(process.env.SRV, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connected to MongoDB")
}).catch((err)=>{
    console.log(err)
})

//🔴몽고DB사용법은 userController에서 설명드렸습니다.

// app.use('/', async (req, res)=>{
// //🍀 User seeding test////////////////
// const newUser= new User({
//     email:"coco@codestates.com",
//     password:'55535'
// })
// newUser.save().then(()=>{
//     console.log("new user saved")
//  })

//🍀 Post seeding test////////////////

// const newPost= new Post({
//     title:'wow',
//     content:'wwwwwww',
//     image:'x',
// })
// newPost.save().then(()=>{
//     console.log("new post saved")
// })
/////////////////////////////

//     res.send("hello world").status(200)
// });

app.get('/main',mainController.mainController)
//?sort={sort}
app.get('/search',mainController.searchController)
//?q={queryString}

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}🚀`)
})