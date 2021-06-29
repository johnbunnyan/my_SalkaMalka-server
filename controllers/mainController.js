/* option 
require("dotenv").config();
*/

const { Post } = require('../models/model');

module.exports = {
  mainController: async (req, res) => {
    const sort = req.query.sort;

    switch (sort) {
      case 'date':
        const query = {
          $project:
            {
              image: 1,
              isOpen: 1,
              sara: 1,
              mara: 1,
              ratio: 1,
              title: 1,
              content: 1,
              userId: 1,
              comment: 1,
              createdAt: 1,
              updatedAt: 1
            }
        }
        const sort = { $sort: { createdAt: -1 } };
        const orderByDate = await Post.aggregate([query, sort]);
        if (orderByDate) {
          res.status(200).send(orderByDate);
        } else {
         res.status(500).send(err);
        }
        
        break;

      case 'popular':
        const query1 = {
          $project:
            {
              image: 1,
              isOpen: 1,
              sara: 1,
              mara: 1,
              ratio: 1,
              title: 1,
              content: 1,
              userId: 1,
              comment: 1,
              createdAt: 1,
              updatedAt: 1,
              commentCount: { $add: [ "$sara", "$mara" ] }
            }
        };
        const sort1 = { $sort: { commentCount: -1 } };
        const orderByPopular = await Post.aggregate([query1, sort1]);

        if (orderByPopular) {
          res.status(200).send(orderByPopular);
        } else {
          res.status(500).send(err);
        }

        break;

      case 'hot-topic':
        const query2 = {
          $project:
            {
              image: 1,
              isOpen: 1,
              sara: 1,
              mara: 1,
              ratio: 1,
              title: 1,
              content: 1,
              userId: 1,
              comment: 1,
              createdAt: 1,
              updatedAt: 1
            }
        };
        const sort2 = { $sort: { ratio: 1 } };
        const orderByHotTopic = await Post.aggregate([query2, sort2]);

        if (orderByHotTopic) {
          res.status(200).send(orderByHotTopic);
        } else {
          res.status(500).send(err);
        }

        break;

      default:
        res.sendStatus(404);
        
        break;
    } 
  },

  searchController: async (req, res) => {
    const queryString = new RegExp(decodeURI(decodeURIComponent(req.query.q)));
    const searchResult = await Post.findOne({ title: queryString });

    if (searchResult) {
      res.status(200).send(searchResult);
    } else {
      res.status(500).send(err);
    }
  }
}