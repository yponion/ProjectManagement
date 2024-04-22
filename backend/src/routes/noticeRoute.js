const {Router} = require('express');
const noticeRouter = Router();
const {Notice, Comment} = require('../models')
const {verifyToken} = require("../utils/jwt");
const {isValidObjectId} = require("mongoose");
const {promise} = require("bcrypt/promises");

// api 공지 생성
noticeRouter.post('/create/:projectId', async (req, res) => {
    const {title, content} = req.body
    const {projectId} = req.params
    if (!title) return res.status(400).send({err: 'title is required'})
    if (!content) return res.status(400).send({err: 'content is required'})
    if (!isValidObjectId(projectId)) return res.status(400).send({err: "projectId is invalid"})
    const user = await verifyToken(req.headers.authorization)

    const notice = new Notice({
        title,
        content,
        name: user.name,
        email: user.email,
        project: projectId,
    })
    await notice.save()
    return res.send({result: 'successful create notice'})
})

// api projectId를 가진 공지 리스트 가져오기
noticeRouter.get('/list/:projectId', async (req, res) => {
    try {
        // console.log('test')
        const {projectId} = req.params
        if (!isValidObjectId(projectId)) return res.status(400).send({err: "projectId is invalid"})

        const notices = await Notice.find({project: projectId}).sort({_id: -1})
        // console.log(notices)
        return res.send({notices})
    } catch (err) {
        console.error(err)
    }
})

// api 공지 get
noticeRouter.get('/:noticeId', async (req, res) => {
    try {
        const {noticeId} = req.params
        if (!isValidObjectId(noticeId)) return res.status(400).send({err: "noticeId is invalid"})

        const notice = await Notice.findOne({_id: noticeId})
        return res.send({notice})
    } catch (err) {
        console.error(err)
    }
})

// api 공지 수정
noticeRouter.put('/edit/:noticeId', async (req, res) => {
    try {
        const {noticeId} = req.params
        if (!isValidObjectId(noticeId)) return res.status(400).send({err: "noticeId is invalid"})
        const {title, content} = req.body
        if (!title) return res.status(400).send({err: 'title is required'})
        if (!content) return res.status(400).send({err: 'content is required'})

        await Notice.updateOne({_id: noticeId}, {$set: {title, content}})
        return res.send({result: 'successful change notice'})
    } catch (err) {
        console.error(err)
    }
})

// api 공지 삭제 (해당 공지의 댓글들도 같이 삭제)
noticeRouter.delete('/:noticeId', async (req, res) => {
    try {
        const {noticeId} = req.params
        if (!isValidObjectId(noticeId)) return res.status(400).send({err: "noticeId is invalid"})

        await Promise.all([
            Notice.deleteOne({_id: noticeId}), // 공자 삭제
            Comment.deleteMany({notice: noticeId}) // 댓글 삭제
        ])
        return res.send({result: 'successful delete notice'})
    } catch (err) {
        console.error(err)
    }
})

module.exports = {
    noticeRouter
}