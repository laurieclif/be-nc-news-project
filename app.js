const express = require("express")
const app = express()
const { getTopics } = require("./controllers/topics.controllers.js")
const { getEndpoints } = require("./controllers/api.controllers.js")
const { getArticles, getArticleById, patchArticleByArticleId } = require("./controllers/articles.controllers.js")
const { getCommentsByArticleId, postCommentByArticleId, deleteCommentByCommentId } = require("./controllers/comments.controllers.js")
const { getUsers } = require("./controllers/users.controllers.js")
const { handlePathNotFoundErrors, handleCustomErrors, handlePsqlPathErrors, handlePsqlInputErrors, handleServerErrors } = require("./errors/index.js")

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.get("/api/articles", getArticles)

app.get("/api/users", getUsers)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.patch("/api/articles/:article_id", patchArticleByArticleId)

app.delete("/api/comments/:comment_id", deleteCommentByCommentId)

app.use(handlePathNotFoundErrors)

app.use(handleCustomErrors)

app.use(handlePsqlPathErrors)

app.use(handlePsqlInputErrors)

app.use(handleServerErrors)

module.exports = app