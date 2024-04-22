const {Router} = require('express')
const {isValidObjectId} = require("mongoose");
const commentRouter = Router()
const {Comment} = require('../models')
const {verifyToken} = require("../utils/jwt");

commentRouter.post('/:noticeId', async (req, res) => {
    try {
        const {content} = req.body
        if (!content) return res.status(400).send("content is required")

        const {noticeId} = req.params
        if (!isValidObjectId(noticeId)) return res.status(400).send({err: "noticeId is invalid"})
        const user = await verifyToken(req.headers.authorization)

        const comment = new Comment({
            content,
            name: user.name,
            email: user.email,
            notice: noticeId,
        })
        await comment.save()
        return res.send({comment})
    } catch (err) {
        console.error(err)
    }
})

commentRouter.get('/list/:noticeId', async (req, res) => {
    try {
        const {noticeId} = req.params
        if (!isValidObjectId(noticeId)) return res.status(400).send({err: "noticeId is invalid"})

        const comments = await Comment.find({notice: noticeId})
        return res.send({comments})
    } catch (err) {
        console.error(err)
    }
})

module.exports = {commentRouter}