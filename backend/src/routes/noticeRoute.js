const {Router} = require('express');
const noticeRouter = Router();
const {Notice, Project} = require('../models')
const {verifyToken} = require("../utils/jwt");
const {isValidObjectId} = require("mongoose");

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

module.exports = {
    noticeRouter
}