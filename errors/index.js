exports.handlePathNotFoundErrors = ('*', (req, res, next) => {
    res.status(404).send({msg: "Not found"})
})

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
    next(err)
}

exports.handlePsqlPathErrors = (err, req, res, next) => {
    if (err.code === "22P02"){
        res.status(400).send({msg: "Invalid path"})
    }
    next(err)
}

exports.handlePsqlInputErrors = (err, req, res, next) => {
    if (err.code === "23502"){
        res.status(400).send({msg: "Not null violation"})
    }
    next(err)
}

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({msg: "Internal server error"})
}