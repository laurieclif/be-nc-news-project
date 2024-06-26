const db = require("../db/connection.js")

const fetchArticles = (topic) => {

    const queryVals = []

    let sqlQuery = `SELECT
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
    ON comments.article_id = articles.article_id `

    if (topic) {
        sqlQuery += `WHERE topic = $1 `
        queryVals.push(topic)
    }

    sqlQuery += `GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
    `
    return db.query(sqlQuery, queryVals)
        .then(({rows}) => {
            return rows
    })
}

const fetchArticleById = (article_id) => {
    return db.query(`SELECT articles.*,
    COUNT (comments.comment_id) :: INT AS comment_count 
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [article_id])
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

const updateVotesByArticleId = (inc_votes, article_id) => {
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [inc_votes, article_id])
    .then(({rows}) => {
        return rows[0]
    })
}

module.exports = { fetchArticles, fetchArticleById, checkArticleExists, updateVotesByArticleId }