const db = require("../db/connection.js")

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(({rows}) => {
        return rows
    })
}

const checkTopicExists = (topic) => {
    return db.query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
    .then(({rows}) => {
        if (!rows.length){
            return Promise.reject({status: 400, msg: "Invalid path"})
        }
    })
}

module.exports = { fetchTopics, checkTopicExists }