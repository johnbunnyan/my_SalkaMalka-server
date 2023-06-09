const mongoose = require("mongoose")
const { isAuthorized } = require('./tokenMethod');
const ObjectId = require('mongoose').Types.ObjectId; 
const { User, Post } = require('../models/model');

module.exports = {
  myPostsController: async (req, res) => {
    const accessTokenData = isAuthorized(req,res);
    if (!accessTokenData) {
      res.status(401).send('토큰이 유효하지 않아요.');
    } else if (accessTokenData) {
      const { userId } = accessTokenData;
      const myPosts = await Post.find().where('userId').equals(userId);

      if (myPosts) {
        res.status(200).send({posts:myPosts});
      } else {
        res.status(500).send('err');
      }
    } else {
      res.status(500).send('err');
    }
  },
  
  myCommentsController: async (req, res) => {
    const accessTokenData = isAuthorized(req,res);

    if (!accessTokenData) {
      res.status(401).send('토큰이 유효하지 않아요.');
    } else if (accessTokenData) {
      const { userId } = accessTokenData;
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

      const query = { "comment.userId": ObjectId(userId) };
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
        if (myComments) {
          res.status(200).send({comments:myComments});
        } else {
          res.status(500).send('err');
        }
      })
    } else {
      res.status(500).send('err');
    }
  },

  deleteMeController: async (req, res) => {
    console.log('delete me')
    const accessTokenData = isAuthorized(req,res);
    if (!accessTokenData) {
      res.status(401).send('토큰이 유효하지 않아요.');
    } else if (accessTokenData) {
      const { userId, provider } = accessTokenData;
      const deleteMe = await User.deleteOne({ _id: userId, provider });

      if (deleteMe.deletedCount === 0) {
        console.log('delete err');
        res.status(500).send('err');
      } else {
        console.log(`Delete count: ${deleteMe.deletedCount}`)
        res.sendStatus(204);
      }
    } else {
      res.status(500).send('err');
    }
  },

  myBookmarksController: async (req, res) => {
    const accessTokenData = isAuthorized(req,res);
    if (!accessTokenData) {
      res.status(401).send('토큰이 유효하지 않아요.');
    } else if (accessTokenData) {
      const { userId, provider } = accessTokenData;
      const userQuery = { _id: userId, provider };
      const user = await User.findOne(userQuery).populate('bookmarks')
      const myBookmarks = user.bookmarks
      if (myBookmarks) {
        res.status(200).send({bookmarks:myBookmarks});
      } else {
        res.status(500).send('err');
      }
    } else {
      res.status(500).send('err');
    }
  },

  addBookmarkController: async (req, res) => {
    const accessTokenData = isAuthorized(req,res);
    if (!accessTokenData) {
      res.status(401).send('토큰이 유효하지 않아요.');
    } else if (accessTokenData) {
      const { postId } = req.body;
      const postQuery = { _id: postId }
      const postToAdd = await Post.findOne(postQuery);
      if (!postToAdd) {
        res.status(404).send('삭제된 살까말까에요.');
      } else {
        const { userId, provider } = accessTokenData;
        const userQuery = { _id: userId, provider };
        const user = await User.findOne(userQuery);
        const beforelength = user.bookmarks.length;
      
        let isexitst=[]
        for(let i=0;i<user.bookmarks.length;i++){
         if(user.bookmarks[i].toString() === postId)
            isexitst.push(user.bookmarks[i])
        }
        if(isexitst.length > 0){
          res.status(409).send("이미 저장한 책갈피에요.")
        }else{
          user.bookmarks.push(postId)
          user.save()
          const afterlength = user.bookmarks.length;
          if (afterlength !== beforelength) {
            res.status(201).send('책갈피를 추가했어요.');
          } else {
            res.status(500).send('err');
          }
        }
      }
    } else {
      res.status(500).send('err');
    }
  },

  deleteBookmarkController: async (req, res) => {
    const accessTokenData = isAuthorized(req,res);
    if (!accessTokenData) {
      res.status(401).send('토큰이 유효하지 않아요.');
    } else if (accessTokenData) {
      const postId = req.params.postId;
      const postQuery = { _id: postId };
      const postToDelete = await Post.findOne(postQuery);

      if (!postToDelete) {
        res.status(404).send('삭제된 살까말까에요.');
      } else {
        const { userId, provider } = accessTokenData;
        const userQuery = { _id: userId, provider };
        const user = await User.findOne(userQuery);
        const beforelength = user.bookmarks.length;
        user.bookmarks.splice(user.bookmarks.indexOf(postId) , 1)
        user.save();
        const afterlength = user.bookmarks.length;

        if (afterlength !== beforelength || afterlength===0) {
          res.status(201).send('책갈피를 삭제했어요.');
        } else {
          res.status(500).send('err');
        }
      }
    } else {
      res.status(500).send('err');
    }
  }
}