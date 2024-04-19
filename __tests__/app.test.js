const app = require("../app.js")
const db = require("../db/connection.js")
const request = require("supertest")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data")
const endpoints = require("../endpoints.json")
const bodyParser = require("body-parser")


beforeEach(() => {
    return seed(data)
 })
 
afterAll(() => {
    return db.end()
 })

 describe("/api/topics", () => {
    test("GET 200: responds with an array of topic objects, each with slug and description properties", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(body.length).toBe(3)
            body.forEach((topic) => {
                expect(topic).toHaveProperty("description")
                expect(topic).toHaveProperty("slug")
            })
        })
    })
    test("GET 404: responds with a 404 not found error message when an incorrect path is given", () => {
        return request(app)
        .get("/api/topikz")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found")
        })
    })
 })

 describe("/api", () => {
    test("GET 200: responds with an object describing all the available endpoints on the API", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual(endpoints)
        })
    })
 })

 describe("/api/articles/:article_id", () => {
    test("GET 200: responds with an article object with the correct properties", () => {
        return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({body}) => {
            const {article} = body
            expect(article).toMatchObject({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
              })
        })
    })
    test("GET 404: responds with a 404 not found error message when an non-existent path is given", () => {
        return request(app)
        .get("/api/articles/26")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("ID not found")
        })
    })
    test("GET 400: responds with a 400 bad request error when given a path with the wrong format", () => {
        return request(app)
        .get("/api/articles/badrequest")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid path")
        })
    })
 })

 describe("/api/articles", () => {
    test("GET 200: responds with an array of all article objects with the correct properties", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toHaveLength(13)
            articles.forEach((article) => {
                expect(article).not.toContain("body")
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    comment_count: expect.any(Number),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                })
            })
        })
    })
    test("GET 200: responds with an array of all article objects with the correct properties sorted by created_at in descending order", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toBeSortedBy("created_at", {descending: true, coerce: false})
        })
    })
    test("GET 200: responds with an array of article objects, each with the correct properties and filtered by the topic queried", () => {
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toHaveLength(12)
            articles.forEach((article) => {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: "mitch",
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                  })
            })
        })
    })
    test("GET 200: responds with an empty array when given a valid topic to filter by, but there are no associated articles", () => {
        return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toHaveLength(0)
        })
    })
    // test("GET 400: responds with a 400 bad request error when queried with a topic which doesn't exist", () => {
    //     return request(app)
    //     .get("/api/articles?topic=invalid")
    //     .expect(400)
    //     .then(({body}) => {
    //         expect(body.msg).toBe("Invalid path")
    //     })
    // })
 })

 describe("/api/articles/:article_id/comments", () => {
    test("GET 200: responds with an array of comments with the correct properties for the given article_id", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body}) => {
            const { comments } = body
            expect(comments).toHaveLength(11)
            comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    "comment_id": expect.any(Number),
                    "votes": expect.any(Number),
                    "created_at": expect.any(String),
                    "author": expect.any(String),
                    "body": expect.any(String),
                    "article_id": 1
                })
            })
        })
    })
    test("GET 200: responds with an array of comments with the given article_id, sorted by created_at in descending order ", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body}) => {
            const { comments } = body
            expect(comments).toBeSortedBy("created_at", {descending: true, coerce: false})
        })
    })
    test("GET 200: responds with an empty array of comments if the article_id is valid but there are no comments on the article", () => {
        return request(app)
        .get("/api/articles/10/comments")
        .expect(200)
        .then(({body}) => {
            const { comments } = body
            expect(comments).toHaveLength(0)
        })
    })
    test("GET 400: responds with a 400 bad request error when given a path with the wrong format", () => {
        return request(app)
        .get("/api/articles/one/comments")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid path")
        })
    })
 })

 describe("/api/articles/:article_id/comments", () => {
    test("POST 201: responds with the posted comment when given an object with the correct properties", () => {
        const newComment = {
            author: "butter_bridge",
            body: "super mario"
        }
        return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(201)
        .then(({body}) => {
            const { comment } = body
            expect(comment.author).toBe("butter_bridge")
            expect(comment.body).toBe("super mario")
            expect(comment.article_id).toBe(2)
        })
    })
    test("POST 400: responds with a 400 bad request error when given a comment body with incorrect column name and incorrect datatype", () => {
        const newComment = {
            aaauthor: true,
            booody: 345
        }
        return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Not null violation")
    })
 })
    test("POST 400: responds with a 400 bad request error when given an empty object as a comment", () => {
        const newComment = {}
        return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Not null violation")
        })
    })
})

describe("/api/articles/:article_id", () => {
    test("PATCH 200: responds with the updated article with votes incremented when passed an inc_votes object and the article_id of the article to update", () => {
        const incrementVotes = { inc_votes : 3 }
        return request(app)
        .patch("/api/articles/1")
        .send(incrementVotes)
        .expect(200)
        .then(({body}) => {
            const { updatedArticle } = body
            expect(updatedArticle).toMatchObject({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                votes: 103,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              })
        })
    })
    test("PATCH 200: responds with the updated article with votes decremented when passed an inc_votes object with a negative number and the article_id of the article to update", () => {
        const decrementVotes = { inc_votes : -20 }
        return request(app)
        .patch("/api/articles/1")
        .send(decrementVotes)
        .expect(200)
        .then(({body}) => {
            const { updatedArticle } = body
            expect(updatedArticle).toMatchObject({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                votes: 80,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              })
        })
    })
    test("PATCH 400: responds with a 400 bad request error when given an incrementVotes body with incorrect property name and incorrect datatype", () => {
        const incrementVotes = { inc_votez : "eleven" }
        return request(app)
        .patch("/api/articles/1")
        .send(incrementVotes)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Not null violation")
        })
    })
    test("PATCH 400: responds with a 400 bad request error when given an empty incrementVotes body", () => {
        const incrementVotes = {}
        return request(app)
        .patch("/api/articles/1")
        .send(incrementVotes)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Not null violation")
        })
    })
    test("PATCH 400: responds with a 400 bad request error when given an invalid article_id in the path", () => {
        const incrementVotes = { inc_votes : 3 }
        return request(app)
        .patch("/api/articles/invalid")
        .send(incrementVotes)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid path")
        })
    })
})

describe("/api/comments/:comment_id", () => {
    test("DELETE 204: responds with no content demonstrating the deleted comment when given a comment_id to delete", () => {
        return request(app)
        .delete("/api/comments/5")
        .expect(204)
    })
    test("DELETE 400: responds with a 400 bad request error when given an invalid comment_id", () => {
        return request(app)
        .delete("/api/comments/secondcomment")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid path")
        })
    })
})

describe("/api/users", () => {
    test("GET 200: responds with an array of user objects, each with the correct properties", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body}) => {
            const { users } = body
            users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                 })
            })
        })
    }) 
})