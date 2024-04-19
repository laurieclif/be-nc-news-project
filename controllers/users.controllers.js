const { fetchUsers } = require("../models/users.models.js")

const getUsers = (req, res, next) => {
    return fetchUsers().then((users) => {
        return res.status(200).send({users})
    })
}

module.exports = { getUsers }