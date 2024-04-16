const express = require("express")
const app = express()
const { getTopics } = require("./controllers/topics.controllers.js")
const { getEndpoints } = require("./controllers/api.controllers.js")
const { getArticleById } = require("./controllers/articles.controllers.js")

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id", getArticleById)

app.use((err, req, res, next) => {
    if (err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
    next(err)
})

app.all('*', (req, res, next) => {
    res.status(404).send({msg: "Not found"})
})

app.use((err, req, res, next) => {
    if (err.code === "22P02"){
        res.status(400).send({msg: "Invalid path"})
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal server error"})
})

module.exports = app