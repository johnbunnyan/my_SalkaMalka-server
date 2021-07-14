/* option 
require("dotenv").config();
*/



const {isAuthorized,
    generateAccessToken,
    generateRefreshToken,
    checkRefeshToken
    
  } =require('./tokenMethod');


const {User} = require('../models/model')
const {Post} = require('../models/model')




module.exports = {


    uploadController:async(req,res)=>{
 
console.log(req.body)

            //이미지를 DB로 넣는 상황

//1. url로 받는 경우
//-> 이미지 이런식으로 올것 'http://t1.daumcdn.net/friends/prod/editor/dc8b3d02-a15a-4afa-a88b-989cf2a50476.jpg'
  //userInfo.user_image=req,body.user_image
console.log(req.file)
console.log(req.body)


        const accessTokenData = isAuthorized(req,res)

      
        if(accessTokenData){

            
            //console.log(req.body)

  if(req.file){
            const imgData=req.file.path
            console.log(req.file)
  
                const newPost= new Post({
                    title:req.body.title,
                    content:req.body.content,
                    keyword:req.body.keyword,
                    image:imgData,
                    userId:req.body.userId,
                })
                newPost.save().then(()=>{
                    console.log("new post saved")
                })
                .then(()=>{
                    res.json("새로운 살까말까를 등록했어요!").status(201)
                })
            .catch(error=>{console.log(error) 
            res.status(500).send("err")})
        }
        else if(!req.file){
      
  
                const newPost= new Post({
                    title:req.body.title,
                    content:req.body.content,
                    keyword:req.body.keyword,
                    // image:imgData,
                    userId:req.body.userId,
                })
                newPost.save().then(()=>{
                    console.log("new post saved")
                })
                .then(()=>{
                    res.json("새로운 살까말까를 등록했어요!").status(201)
                })
            .catch(error=>{console.log(error) 
            res.status(500).send("err")})
        }
        else{
            res.status(401).json("토큰이 유효하지 않아요.") 
        }



    }
},



seePostController:async(req,res)=>{
console.log(req.params.postId)
    
        Post.findById(req.params.postId)
        .populate('userId').populate('comment.userId')
        //지금은 유저아이디 세부정보까지 주고 있긴한데 populate빼면 됨
        .then((posts)=>  res.json(posts).status(200))
        .catch(()=>res.status(404).json('삭제된 살까말까예요!'))
        .catch(()=>res.status(500).send("err")) 
        

        
},




deletePostController:async(req,res)=>{
    //토큰 라우팅

    const accessTokenData = isAuthorized(req,res)

        if(accessTokenData){

            console.log(req.params.postId)
            console.log(req.headers.authorization.split(" ")[1])
            try{
                Post.findByIdAndDelete(req.params.postId)
                .then((posts)=> res.status(204).send())
                
            }catch(e){
                    res.status(500).json("err")
            }
        }else{
            res.status(401).json("토큰이 유효하지 않아요.")
        }




},



closePostController:async(req,res)=>{
//토큰 라우팅

const accessTokenData = isAuthorized(req,res)


if(accessTokenData){



//(옵션)
//req.body.judgement === 코멘트아이디 ->의 isJudgement를 true로 +코멘트 쓴사람 point 1추가

if(req.body.judgement){
    
    Post.updateOne({
        "_id": req.params.postId, //this is level O select
        "comment": {
            "$elemMatch": {
                "_id": req.body.judgement, //this is level one select
             
            }
        }
    },
        {
            // "$set": {
            //     "comment.$[outer].like": +1,
            // },
            "$set": {
                "comment.$[outer].isJudgement": true,
            }
        },
        {
            "arrayFilters": [
                { "outer._id":req.body.judgement}, 
               
            ]
        })
                .then((out)=>{
                        console.log("judgement updated")
                        
                        console.log(out)
                        
                        Post.findOne({
                            "_id": req.params.postId, //this is level O select
                            "comment": {
                                "$elemMatch": {
                                    "_id": req.body.judgement, //this is level one select
                                 
                                }
                            }
                        },
                        {
                        
                            comment:{
                                $elemMatch:{
                                    _id:req.body.judgement
                                },
                            }
                        }
                        
                        ).populate('comment.userId')
                        .then((liked)=>{console.log(liked.comment[0].userId)
                            let id=liked.comment[0].userId._id
                            console.log(id)
                            //liked.comment[0].userId.point.updateOne({$inc:{point:1}})
                        User.findByIdAndUpdate(id, {$inc:{point:1}},
                            {new:true}
                            )
                        .then((out)=>console.log(out))
                        })
                })

    }

    //req.body.best === 배열속 코멘트아이디들 ->각각의 isBest를 true로 +코멘트 쓴사람 point 1추가
    if(req.body.best){
    req.body.best.map((el)=>
    
    Post.updateOne({
        "_id": req.params.postId, //this is level O select
        "comment": {
            "$elemMatch": {
                "_id": el, //this is level one select
             
            }
        }
    },
        {
            // "$set": {
            //     "comment.$[outer].like": +1,
            // },
            "$set": {
                "comment.$[outer].isBest": true,
            }
        },
        {
            "arrayFilters": [
                { "outer._id":el}, 
               
            ]
        })
                .then((out)=>{
                        console.log("judgement updated")
                        
                        console.log(out)
                        
                        Post.findOne({
                            "_id": req.params.postId, //this is level O select
                            "comment": {
                                "$elemMatch": {
                                    "_id": el, //this is level one select
                                 
                                }
                            }
                        },
                        {
                        
                            comment:{
                                $elemMatch:{
                                    _id:el
                                },
                            }
                        }
                        
                        ).populate('comment.userId')
                        .then((liked)=>{console.log(liked.comment[0].userId)
                            let id=liked.comment[0].userId._id
                            console.log(id)
                            //liked.comment[0].userId.point.updateOne({$inc:{point:1}})
                        User.findByIdAndUpdate(id, {$inc:{point:1}},
                            {new:true}
                            )
                        .then((out)=>console.log(out))
                        })
                })
    )
    
        }





        Post.findByIdAndUpdate(req.params.postId,{isOpen:false},{
            new:true,
            //runValidators:true
        })
        .then((posts)=> {
            if (posts) {
                res.json("더이상 사라마라를 받지 않아요.").status(200)
            } else {
                res.status(404).json('삭제된 살까말까예요!');
            }
        })
        .catch(e => console.log(e));

}else{
    res.status(401).json("토큰이 유효하지 않아요.")

}
    
    //res.status(500).send("err");
    },
}