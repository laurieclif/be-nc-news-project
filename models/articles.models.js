const db = require("../db/connection.js")

const fetchArticles = () => {
    return db.query(`SELECT
        articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT (comments.article_id) :: INT AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`)
        .then(({rows}) => {
        return rows
    })
}

const fetchArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({rows}) => {
        if (!rows.length){
            return Promise.reject({status: 404, msg: "ID not found"})
        }
        return rows[0]
    })
}

const checkArticleExists = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({rows}) => {
        if (!rows.length){
            return Promise.reject({status: 404, msg: "Not found"})
        } 
    })
}

module.exports = { fetchArticles, fetchArticleById, checkArticleExists }