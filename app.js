const express = require("express")
const app = express()
const { getTopics } = require("./controllers/topics.controllers.js")
const { getEndpoints } = require("./controllers/api.controllers.js")
const { getArticles, getArticleById, patchArticleByArticleId } = require("./controllers/articles.controllers.js")
const { getCommentsByArticleId, postCommentByArticleId, deleteCommentByCommentId } = require("./controllers/comments.controllers.js")

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.patch("/api/articles/:article_id", patchArticleByArticleId)

app.delete("/api/comments/:comment_id", deleteCommentByCommentId)

app.all('*', (req, res, next) => {
    res.status(404).send({msg: "Not found"})
})

app.use((err, req, res, next) => {
    if (err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
    next(err)
})

app.use((err, req, res, next) => {
    if (err.code === "22P02"){
        res.status(400).send({msg: "Invalid path"})
    }
    next(err)
})

app.use((err, req, res, next) => {
    if (err.code === "23502"){
        res.status(400).send({msg: "Not null violation"})
    }
    next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal server error"})
})

module.exports = app