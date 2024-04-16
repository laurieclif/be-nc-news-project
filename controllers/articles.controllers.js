const { fetchArticles, fetchArticleById } = require("../models/articles.models.js")

const getArticles = (req, res, next) => {
    return fetchArticles().then((articles) => {
        return res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}

const getArticleById = (req, res, next) => {
    const { article_id } = req.params
    return fetchArticleById(article_id).then((article) => {
        return res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getArticles, getArticleById }