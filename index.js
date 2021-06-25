const express = require("express")
const cors = require("cors")
const logger = require('morgan');
const mongoose = require("mongoose")





const signController = require('./controllers/signController')
const mainController =require('./controllers/mainController');
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const commentRouter = require('./routes/comment')


require("dotenv").config();
const {User} = require('./models/model')
const {Post} = require('./models/model')


const app = express()
const port = process.env.PORT || 5000;

app.use(express.json()); //req.body 접근하게 해주는 미들웨어
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET, POST, OPTIONS, PUT'],
  credentials: true
}));


//console.log(process.env.SRV)
mongoose.connect(process.env.SRV,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connected to MongoDB")
}).catch((err)=>{
    console.log(err)
})






app.use('/user', userRouter)
app.use('/post', postRouter)
app.use('/comment', commentRouter)

app.post('/signin', signController.signiInController)
app.post('/signout', signController.signOutController)
app.post('/signup', signController.signUpController)
app.post('/refreshtoken', signController.refreshTokenController)


app.get('/main',mainController.mainController)
//?sort={sort}
app.get('/search',mainController.searchController)
//?q={queryString}


//라우팅 우선순위 문제
app.use('/', (req,res,next)=>{

    
    //🍀 User seeding(create) test////////////////
    // const newUser= new User({
    //     email:"coco@codestates.com",
    //     password:'55535'
    // })
    // newUser.save().then(()=>{
    //     console.log("new user saved")
    //})
    
    //🍀 Post seeding(create) test////////////////
    // console.log(Post)
    //이따가는 new Post()의 인자로 req.body주면 됨
    
    
    // const newPost= new Post({
    //     title:'몽고',
    //     content:'디비디비',
    //     image:'x',
    //     userId:'60d4259b4751682e7e973021',
    //     comment:{
    //         type:false,
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
    
    
    });



app.listen(port, ()=>{
    console.log(`Server is running on port ${port} 🚀`)
})