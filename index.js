const express = require("express");
const cors = require("cors");
const logger = require('morgan');
const mongoose = require("mongoose")

const mainController =require('./controllers/mainController');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

require("dotenv").config();
const {User} = require('./models/model')
const {Post} = require('./models/model')

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

app.use('/uploads', express.static('uploads'))
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);


app.get('/main',mainController.mainController)
//?sort={sort}
app.get('/search',mainController.searchController)
//?q={queryString}


//라우팅 우선순위 문제
app.use('/', (req,res,next)=>{

    
    // //🍀 User seeding(create) test////////////////
    // const newUser= new User({
    //     email:"jenny@codestates.com",
    //     password:'8888'
    // })
    // newUser.save().then(()=>{
    //     console.log("new user saved")
    // })

     //🍀 post.comment seeding(create) test////////////////
     //console.log(Post)
     
//      Post.findById('60d60036f605cd8c66a29aa2')
//     .then((doc)=>{
//         console.log(doc)
//     doc.comment.push(
//         {
//     type:true,
//     like:22,
//      //content:"후회할 거야",
//     userId:'60d5ddd7be68577ec8df630b'
//     }
//     )
//     doc.save()
//     })
// .then((out)=>{
//         console.log("new comment saved")
//         res.json(out).status(200)
//     })

    
    //🍀 Post seeding(create) test////////////////
    // console.log(Post)
    //이따가는 new Post()의 인자로 req.body주면 됨
    
    
    // const newPost= new Post({
    //     title:'몽고',
    //     content:'디비디비',
    //     image:'x',
    //     userId:'60d4259b4751682e7e973021',
    //     sara:1,
    //     comment:{
    //         like:1,
    //         userId:'60d4254dec6bbb2e33526cfb'
    //     }
    // })
    // newPost.save().then(()=>{
    //     console.log("new post saved")
    // })
    // res.json(newPost).status(200)
    
    
    //🖍 수정하기 🖍
    // const post = await Post.updateMany({title:"구름빵"}, 
    // {title:"구름빵",
    // content:'구름처럼 생김',
    //     image:'x',
    //     userId:'60d42c224f9cf13167106903',
    //     comment:{
    //         type:false,
    //         like:7,
    //         userId:'60d4254dec6bbb2e33526cfb'
    //     }
    // })
    // .then((update)=>res.json(update).status(200))
    
    //✂️ 삭제하기 ✂️
    // const post = await Post.deleteMany({title:"새신발"})
    // .then((update)=>res.json(update).status(200))
    
    
    //👀 조회하기 👀
    //User.find().then((users)=>res.json(users).status(200))
    //Post.find().populate('userId').populate('comment.userId').then((posts)=>  res.json(posts).status(200))
    
    /////////////////////////////
    res.status(200).send("hello I'm server:), please request me with more endpoints >_<")
    
    });



app.listen(port, ()=>{
    console.log(`Server is running on port ${port} 🚀`)
})