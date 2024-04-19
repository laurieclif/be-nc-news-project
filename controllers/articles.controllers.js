const {
  fetchArticles,
  fetchArticleById,
  updateVotesByArticleId,
} = require("../models/articles.models.js");
const { checkTopicExists } = require("../models/topics.models.js")

const getArticles = (req, res, next) => {
  const { topic } = req.query
  // return Promise.all([fetchArticles(topic), checkTopicExists(topic)]).then((articles) => {
  //   return res.status(200).send({articles})
  // })
  return fetchArticles(topic)
    .then((articles) => {
      return res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticleById(article_id)
    .then((article) => {
      return res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return updateVotesByArticleId(inc_votes, article_id)
    .then((updatedArticle) => {
      return res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticles, getArticleById, patchArticleByArticleId };
