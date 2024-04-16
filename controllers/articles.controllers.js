const { fetchArticleById } = require("../models/articles.models.js")

const getArticleById = (req, res, next) => {
    console.log(req.params.article_id)
    const { article_id } = req.params
    return fetchArticleById(article_id).then((article) => {
        return res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getArticleById }