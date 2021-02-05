module.exports = function (req,res,next) {
    if(!req.session.isAuthenticated){
        console.log("user is not authorized")

        return res.sendStatus(204)

    }
    next()
}
