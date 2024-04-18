const db = require("../db/connection.js")

const fetchUsers = () => {
    return db.query(`SELECT * FROM users;`).then(({rows}) => {
        console.log(rows)
        return rows
    })
}

module.exports = { fetchUsers }