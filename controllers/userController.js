/* option 
require("dotenv").config();
*/

const { User, Post } = require('../models/model');

module.exports = {
  myPostsController: async (req, res) => {
    const accessTokenData = isAuthorized(req);
    if (!accessTokenData) {
      res.status(401).send('토큰이 유효하지 않아요.');
    } else if (accessTokenData) {
      const { userId } = accessTokenData;
      const myPosts = await Post.find({ userId: userId }).pretty();

      if (myPosts) {
        res.status(200).send(myPosts);
      } else {
        res.status(500).send('err');
      }
    } else {
      res.status(500).send('err');
    }
  },
  
  myCommentsController: async (req, res) => {
    const accessTokenData = isAuthorized(req);
    if (!accessTokenData) {
      res.status(401).send('토큰이 유효하지 않아요.');
    } else if (accessTokenData) {
      const { userId } = accessTokenData;
      // needs testing
      const myComments = await Post.find(
        { "comment.0.userId": userId }, 
        { _id: 0, "comment.0._id": 1, 
          "comment.0.userId": 1, 
          "comment.0.type": 1, 
          "comment.0.like": 1 })
        .pretty();

      if (myComments) {
        res.status(200).send(myComments);
      } else {
        res.status(500).send('err');
      }
    } else {
      res.status(500).send('err');
    }
  },

  deleteMeController: async (req, res) => {
    const accessTokenData = isAuthorized(req);
    if (!accessTokenData) {
      res.status(401).send('토큰이 유효하지 않아요.');
    } else if (accessTokenData) {
      const { userId } = accessTokenData;
      const deleteMe = await User.deleteOne({ _id: userId });

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
}