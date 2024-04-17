const { fetchCommentsByArticleId, insertCommentByArticleId } = require("../models/comments.models.js")
const { checkArticleExists } = require("../models/articles.models.js")

const getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    return Promise.all([fetchCommentsByArticleId(article_id), checkArticleExists(article_id)]).then((comments) => {
        return res.status(200).send({comments: comments[0]})
    })
    .catch((err) => {
        next(err)
    })
}

const postCommentByArticleId = (req, res, next) => {
    const { author, body } = req.body
    const { article_id } = req.params
    return (insertCommentByArticleId(article_id, {author, body}))
    .then((comment) => {
       return res.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getCommentsByArticleId, postCommentByArticleId }