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

    //사라마라 컨트롤러
newCommentController:async(req,res)=>{


    try {


        let isOpen=null
        await Post.findById(req.params.postId)
        .then((open)=>{console.log(open.isOpen); isOpen=open.isOpen})
        console.log(isOpen)
        
        if(isOpen === true){
            //사라나 마라는 무조건 있어야한다.
            //console.log("wwwwwww")
        if(req.body.type === 'sara'||req.body.type === 'mara'){
          //1. 코멘트 콘텐트가 있으면 배열에 넣는다
            if(req.body.content){
                 Post.findById(req.params.postId)
                .then((doc)=>{
                    console.log(req.body.type)
                    doc.comment.push(
                    {
                 content:req.body.content,
                userId:req.body.userId,
                type:req.body.type
                }
                )
                doc.save()
                })
            .then((out)=>{
                    console.log("new comment saved")
                })
        
        }
        
         //2. 사라마라 요청마다 1씩 더한다
        if(req.body.type === 'sara'){
            //sara카운트 올리기(update)
            Post.findByIdAndUpdate(req.params.postId,{$inc:{sara:1}},{
                new:true,
                //runValidators:true
            })
            .then(()=>{
                console.log("사라를 등록했어요!")


                //ratio 계산
                //마라랑 사라 값 가져오기
                //둘이 계산
                //ratio에 넣기
                

//  const post = await Post.updateMany({title:"구름빵"}, 
//     {title:"구름빵",
//     content:'구름처럼 생김',
//         image:'x',
//         userId:'60d42c224f9cf13167106903',
//         comment:{
//             type:false,
//             like:7,
//             userId:'60d4254dec6bbb2e33526cfb'
//         }
//     })
    // .then((update)=>res.json(update).status(200))


                //코멭츠를 뽑아내는 기준(현재 포스트아이디)
            Post.findById(req.params.postId)
            .then((result)=>{
            console.log(result)
            let ratiocal=function(){
                let min=Math.min(result.sara,result.mara)
                let max=Math.max(result.sara,result.mara)
                return (1- min/max)
                
            }
            let ratio=ratiocal()
            console.log(ratio)
            console.log(req.params.postId)
            const update = Post.updateOne({_id:req.params.postId},{
                ratio:ratio
            }).then((update)=> res.json({comments:result.comment}).status(201))
    
           
                })


            })
            .catch(error=>{console.log(error) 
                res.status(404).send("삭제된 살까말까에요!")})
        
        }
        else if(req.body.type==='mara'){
            //mara카운트 올리기(update)
            Post.findByIdAndUpdate(req.params.postId,{$inc:{mara:1}},{
                new:true,
                //runValidators:true
            })
            .then(()=>{
                console.log("마라를 등록했어요!")
       //코멭츠를 뽑아내는 기준(현재 포스트아이디)
       Post.findById(req.params.postId)
       .then((result)=>{
       console.log(result)
       let ratiocal=function(){
           return Math.abs(1-(result.sara - result.mara)*0.01)
       }
       let ratio=ratiocal()
       console.log(ratio)
       console.log(req.params.postId)
       const update = Post.updateOne({_id:req.params.postId},{
           ratio:ratio
       }).then((update)=> res.json({comments:result.comment}).status(201))

      
           })


               
            })
        .catch(error=>{console.log(error) 
        res.status(404).send("삭제된 살까말까에요!")})
        }
        
        }
        
        else{
            res.status(400).json("사라 혹은 마라 둘 중 하나를 투표해주세요!")
        }

        }else if(isOpen === false){
            res.status(409).send("닫혀 있는 살까말까예요!")
        }


        
    } catch (error) {
        res.status(500).send("err")  
    }



},



likeCommentController:async(req,res)=>{

        console.log(req.params.commentId)

try {
    let isOpen=null
    await Post.findById(req.params.postId)
    .then((open)=>{console.log(open.isOpen); isOpen=open.isOpen})
    console.log(isOpen)
    
    if(isOpen === true){
        Post.updateOne({
            "_id": req.params.postId, //this is level O select
            "comment": {
                "$elemMatch": {
                    "_id": req.params.commentId, //this is level one select
                 
                }
            }
        },
            {
                // "$set": {
                //     "comment.$[outer].like": +1,
                // },
                "$inc": {
                    "comment.$[outer].like": 1,
                }
            },
            {
                "arrayFilters": [
                    { "outer._id":req.params.commentId }, 
                   
                ]
            })
                    .then((out)=>{
                            console.log("like updated")
                            res.status(200).json("like")
                        })
    
        .catch(error=>{console.log(error) 
            res.status(500).send("삭제된 사라마라예요!")})
    
    }
    else if(isOpen === false){
        res.status(409).send("닫혀 있는 살까말까예요!")
    }
    
} catch (error) {
    res.status(500).send("err")
}






    },


    //코멘트 달면 응답으로 해당 포스트아이디도 주는데 저장했다가 삭제할때 줄수 있나?
    deleteCommentController:async(req,res)=>{
        const accessTokenData = isAuthorized(req)

        if(accessTokenData){
            Post.findById(req.params.postId)
            .then((doc)=>{
                        console.log(doc)
                        doc.comment.pull(req.params.commentId)
                    
                    doc.save()
                    }).then((out)=>{
                        console.log("comment deleted")
                        res.status(204).end()
                    })


        }else if(!accessTokenData){
            res.status(401).send("토큰이 유효하지 않아요.")
        }else{
            res.status(500).send("err")
        }

    },
    
}