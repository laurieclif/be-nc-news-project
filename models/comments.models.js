const { error } = require("console")
const db = require("../db/connection.js")

const fetchCommentsByArticleId = (article_id) => {
    return db.query(`SELECT * 
    FROM comments 
    WHERE article_id = $1
    ORDER BY created_at DESC;`, [article_id])
    .then(({rows}) => {
        return rows
    })
}

const insertCommentByArticleId = (article_id, newComment) => {
    const { author, body } = newComment
    return db.query(`INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`, [article_id, author, body])
    .then(({rows}) => {
        return rows[0]
    })
}

const removeCommentByCommentId = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
    .then(({rows}) => {
    })
}

module.exports = { fetchCommentsByArticleId, insertCommentByArticleId, removeCommentByCommentId }