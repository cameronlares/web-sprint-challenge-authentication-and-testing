const { expectCt } = require("helmet")
const supertest = require("supertest")
const server = require("./server")

describe("server.js", () => {
    describe("GET /", () => {
        it(" should return 200 OK", () => {
            return supertest(server)
            .get("/")
            .then(res => {
                expect(res.status).toBe(200)
            })
        })
     
    })
})