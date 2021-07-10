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
        if(req.body.type === 'sara'||req.body.type === 'mara'){
            






// 코멘트 콘텐트가 있으면 배열에 넣는다
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
                    //2. 사라마라 요청마다 1씩 더한다
           if(req.body.type === 'sara'){
            //sara카운트 올리기(update)
            Post.findByIdAndUpdate(req.params.postId,{$inc:{sara:1}},{
                new:true,
                //runValidators:true
            })
            .then(()=>{
                console.log("사라를 등록했어요!")
 
 
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
            }).then((update)=> res.json({comments:result.comment, sara:result.sara, mara:result.mara}).status(201))
    
           
                })
 
 
            })
            .catch(error=>{console.log(error) 
                res.status(404).send("삭제된 살까말까에요!")})
        
        }
        else if(req.body.type==='mara'){
            //mara카운트 올리기(update)
            Post.findByIdAndUpdate(req.params.postId,{$inc:{mara:1}},{
                new:true,
                useFindAndModify:false
            })
            .then(()=>{
                console.log("마라를 등록했어요!")
       
       Post.findById(req.params.postId)
       .then((result)=>{
       //console.log(result)
       let ratiocal=function(){
           return Math.abs(1-(result.sara - result.mara)*0.01)
       }
       let ratio=ratiocal()
       console.log(ratio)
       console.log(req.params.postId)
       const update = Post.updateOne({_id:req.params.postId},{
           ratio:ratio
       }).then((update)=> res.json({comments:result.comment, sara:result.sara, mara:result.mara}).status(201))
 
      
           })
 
 
               
            })
        .catch(error=>{console.log(error) 
        res.status(404).send("삭제된 살까말까에요!")})
        }
                })
        
        }else{
//comment를 쓰지 않았을 때 그냥 카운트만 올리기


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
               }).then((update)=> res.json({comments:result.comment, sara:result.sara, mara:result.mara}).status(201))
       
              
                   })
    
    
               })
               .catch(error=>{console.log(error) 
                   res.status(404).send("삭제된 살까말까에요!")})
           
           }
           else if(req.body.type==='mara'){
               //mara카운트 올리기(update)
               Post.findByIdAndUpdate(req.params.postId,{$inc:{mara:1}},{
                   new:true,
                   useFindAndModify:false
               })
               .then(()=>{
                   console.log("마라를 등록했어요!")
          //코멭츠를 뽑아내는 기준(현재 포스트아이디)
          Post.findById(req.params.postId)
          .then((result)=>{
          //console.log(result)
          let ratiocal=function(){
              return Math.abs(1-(result.sara - result.mara)*0.01)
          }
          let ratio=ratiocal()
          console.log(ratio)
          console.log(req.params.postId)
          const update = Post.updateOne({_id:req.params.postId},{
              ratio:ratio
          }).then((update)=> res.json({comments:result.comment, sara:result.sara, mara:result.mara}).status(201))
    
         
              })
    
    
                  
               })
           .catch(error=>{console.log(error) 
           res.status(404).send("삭제된 살까말까에요!")})
           }




        }
        
        
        }
        
        else{
            res.status(400).json("사라 혹은 마라 둘 중 하나를 투표해주세요!")
        }

        }else if(isOpen === false){
            res.status(409).send("닫혀 있는 살까말까예요!")
        }


        
    } catch (error) {
        //res.status(500).send("err")  
        res.status(404).send("삭제된 살까말까에요!")
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
        //포스트가 열려있는데, 만약 해당 코멘트를 자신이 썼으면 작동안하도록은 가능!
        //body의 userId는 코멘트를 쓴 사람->api문서에서의 정의하기로는
        //해당 코멘트에 이미 그 코멘트를 쓴 userId가 있고
        //body의 userId를 like누르는 사람의 userId로 바꿔서 준다면
        //해당 코멘트 쓴 userId와 req로 들어온 userId 서로 비교해서 
        //같지 않을때만 실행되도록
       


Post.findOne({
            "_id": req.params.postId, //this is level O select
            "comment": {
                $elemMatch: {
                    "_id": req.params.commentId, //this is level one select
                 
                }
            }
        },
        {
            'comment': {
                $elemMatch : {
                    '_id' : req.params.commentId
                }
            }
        }, 
        // function(err,result){
        //     console.log(result.comment);
        //    console.log(result.comment[0].like);
        //    if(result.comment[0].like===req.body.userId){
        //        res.status(400).send("이미 좋아요를 눌렀습니다.")
        //    }
        // }
        )
        .then((output)=>{
            console.log(output)
            console.log(output.comment[0].like)
            
            let isexitst=[]
            for(let i=0;i<output.comment[0].like.length;i++){
             if(output.comment[0].like[i].toString() === req.body.userId)
                isexitst.push(output.comment[0].like[i])
              
            }
            console.log(isexitst)

            if(isexitst.length > 0){
                       res.status(400).send("이미 좋아요를 눌렀습니다.")
                   }
                   else{

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
                            "$push": {
                                "comment.$[outer].like": req.body.userId,
                            }
                        },
                        {
                            "arrayFilters": [
                                { "outer._id":req.params.commentId }, 
                               
                            ],
                            "upsert":true
                        })
                                .then((out)=>{
                                        console.log("like updated")
                                        
                                        console.log(out)
            //////////////////////////////////////////////////////
                                        Post.findOne({
                                            "_id": req.params.postId, //this is level O select
                                            "comment": {
                                                "$elemMatch": {
                                                    "_id": req.params.commentId, //this is level one select
                                                 
                                                }
                                            }
                                        },
                                        {
                                        
                                            comment:{
                                                $elemMatch:{
                                                    _id:req.params.commentId
                                                },
                                            }
                                        }
                                        
                                        )
                                        .then((liked)=>{console.log(liked.comment[0].like)
                                            if(out.nModified !== 0){
                                            res.status(200).json({"like":liked.comment[0].like.length})
                                            }else{
                                                res.status(500).send("삭제된 사라마라예요!")
                                            }
                                        })
            
                                    })
                
                    .catch(error=>{console.log(error) 
                        res.status(500).send("삭제된 사라마라예요!")})

                   }
        })
        


       
    
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
        const accessTokenData = isAuthorized(req,res)
console.log(accessTokenData)
const { userId } = accessTokenData;

        if(accessTokenData){
            Post.findById(req.params.postId)
            .then((doc)=>{
                        console.log(doc)
                        doc.comment.pull(req.params.commentId)
                    
                    doc.save()
                    .then(()=>{



                        //삭제하는 코멘트의 타입이 사라인지 마라인지에 따라
                        //$inc -1
                        Post.findByIdAndUpdate(req.params.postId,{$inc:{sara:-1}},{
                            new:true,
                            //runValidators:true
                        })


                        Post.findById(req.params.postId)
                        .then((doc)=>{
                            console.log(doc)
                            console.log("comment deleted")
                            //포스트들의 코멘트들 아이디까지 가서 아이디까고
                            //그 이메일이 맞아떨어진 거만 골라서 보내주기
                            let myComments = [];

                            function addComments(json) {
                              let comments = json.comment;
                              let postId = json._id;
                      
                              comments.forEach(comment => {
                                comment.postId = postId;
                                comment.commentId = comment._id;
                                delete comment._id;
                              });
                      
                              myComments = [...myComments, ...comments];
                            }
                      
                            const query = { "comment.userId": userId };
                            const project = {
                              'comment.userId': 1,
                              'comment.type': 1,
                              'comment.like': 1,
                              'comment.content': 1,
                              'comment._id': 1
                            }
                      
                            Post.find(query)
                            .cursor()
                            .on('data', function(doc) {
                              let str = JSON.stringify(doc);
                              let json = JSON.parse(str);
                              addComments(json);
                            })
                            .on('end', function() {
                      
                              myComments = myComments.filter(i => i.userId === userId)
                      console.log(myComments)
                             
                            })
                          




                            res.status(200).json({"comments":doc.comment, "userComments":myComments })
                        })
                    })
                    })


        }else if(!accessTokenData){
            res.status(401).send("토큰이 유효하지 않아요.")
        }else{
            res.status(500).send("err")
        }

    },
    
}