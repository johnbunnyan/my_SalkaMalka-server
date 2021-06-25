/* option 
require("dotenv").config();
*/
  
const { User, Post } = require('../models/model');

module.exports = {
  mainController: async (req, res) => {
    const sort = req.query.sort;

    switch (sort) {
      case 'date':
        const orderByDate = await Post.find({}, { sort: { _id: 1 } }).pretty();
        // {
        //   _id, // postId
        //   userId
        //   title,
        //   image,
        //   content,
        //   isOpen,
        //   comment: [
        //     {
        //       _id,
        //       type,
        //       like,
        //       content,
        //       userId: { $ref, $id, $db }
        //     }
        //   ]
        // }

        if (orderByDate) {
          res.status(200).send(orderByDate);
        } else {
         res.status(500).send(err);
        }
        
        break;

      case 'popular':
        const query = { $group: { _id: '$_id', commentCount: { $comment: { $sum: 1 } } } };
        const sort = { $sort: { commentCount: -1 } };
        const orderByPopular = await Post.aggregate([ query, sort ]);

        if (orderByPopular) {
          res.status(200).send(orderByPopular);
        } else {
          res.status(500).send(err);
        }

        break;

      case 'hotTopic':
        const orderByHotTopic = await Post.find({}, { sort: { _id: 1 } }).pretty();

        if (orderByHotTopic) {
          res.status(200).send(orderByHotTopic);
        } else {
          res.status(500).send(err);
        }

        break;

      default:
        res.status(404).send();

        break;
    } 
  },

  searchController: async (req, res) => {
    const queryString = req.query.q;
    const searchResult = await Post.find({ title: /${queryString}/ }).pretty();

    if (searchResult) {
      res.status(200).send(searchController);
    } else {
      res.status(500).send(err);
    }
  }
}