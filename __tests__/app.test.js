const app = require("../app.js")
const db = require("../db/connection.js")
const request = require("supertest")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data")


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
    test("GET 404: responds with a 404 not found error message when a non-existent path is given", () => {
        return request(app)
        .get("/api/topikz")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found")
        })
    })
 })
