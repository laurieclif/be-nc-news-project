const app = require("../app.js")
const db = require("../db/connection.js")
const request = require("supertest")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data")
const endpoints = require("../endpoints.json")


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
    test("GET 404: responds with a 404 not found error message when an incorrect path is given", () => {
        return request(app)
        .get("/ipi")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found")
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
