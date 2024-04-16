const endpoints = require("../endpoints.json")

const getEndpoints = (re, res, next) => {
       return res.status(200).send(endpoints)
}

module.exports = { getEndpoints }