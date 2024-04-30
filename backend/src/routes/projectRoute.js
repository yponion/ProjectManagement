const {Router} = require('express');
const projectRouter = Router();
const {User, Project, Notice, Comment, Task} = require('../models')
const {verifyToken} = require('../utils/jwt')
const {isValidObjectId} = require("mongoose");

// api 프로젝트 생성
projectRouter.post('/create', async (req, res) => {
    try {
        const {title, type, start, end, memberList} = req.body
        if (!title) return res.status(400).send({err: "title is required"})
        if (!type) return res.status(400).send({err: "type is required"})
        if (!start) return res.status(400).send({err: "startDate is required"})
        if (!end) return res.status(400).send({err: "endDate is required"})

        const email = await verifyToken(req.headers.authorization).email
        if (!memberList.includes(email)) memberList.push(email)


        const project = new Project({
            title,
            type,
            start,
            end,
            leader: email,
            memberList
        })
        await project.save()
        return res.status(200).send({msg: "successful create project"})
    } catch (err) {
        console.error(err)
    }
})

// api 프로젝트에 멤버를 추가하기 위해 db에 user.emil의 유무 확인
projectRouter.get('/create/:email', async (req, res) => {
    try {
        const {email} = req.params
        if (!email) return res.status(400).send({err: 'email is required'})

        const existEmail = await User.findOne({email})
        if (!existEmail) return res.status(200).send({result: 'not exist'})
        return res.status(200).send({result: 'exist'})
    } catch (err) {
        console.error(err)
    }
})

// api 자신이 속한 프로젝트 가져오기
projectRouter.get('/', async (req, res) => {
    try {
        const email = await verifyToken(req.headers.authorization).email
        const projects = await Project.find({memberList: email}).sort({_id: -1})
        return res.send({projects})
    } catch (err) {
        console.error(err)
    }
})

// api 프로젝트 가져오기
projectRouter.get('/:projectId', async (req, res) => {
    try {
        const {projectId} = req.params
        if (!isValidObjectId(projectId)) return res.status(400).send({err: "projectId is invalid"})
        const project = await Project.findOne({_id: projectId})
        return res.send({project})
    } catch (err) {
        console.error(err)
    }
})

// api 프로젝트 관리자 승인
projectRouter.get('/pm/:projectId', async (req, res) => {
    try {
        const {projectId} = req.params
        if (!isValidObjectId(projectId)) return res.status(400).send({err: "projectId is invalid"})
        const project = await Project.findOne({_id: projectId})
        const email = await verifyToken(req.headers.authorization).email

        if (project.leader === email) return res.send({result: true})
        else return res.send({result: false})
    } catch (err) {
        console.error(err)
    }
})

// api 프로젝트 수정
projectRouter.put('/edit/:projectId', async (req, res) => {
    try {
        const {projectId} = req.params
        if (!isValidObjectId(projectId)) return res.status(400).send({err: 'projectId is invalid'})
        const {title, type, start, end, memberList} = req.body

        await Project.updateOne({_id: projectId}, {$set: {title, type, start, end, memberList}})

        return res.send({result: 'successful edit project'})
    } catch (err) {
        console.log(err)
    }
})

// api 프로젝트 리더 변경
projectRouter.put('/edit/leader/:projectId', async (req, res) => {
    try {
        const {projectId} = req.params
        if (!isValidObjectId(projectId)) return res.status(400).send({err: 'projectId is invalid'})
        const {leader} = req.body
        if (!leader) return res.status(400).send({err: 'leader is required'})

        await Project.updateOne({_id: projectId}, {$set: {leader}})
        return res.send({result: 'successful change leader'})
    } catch (err) {
        console.log(err)
    }
})

// api 프로젝트 삭제
projectRouter.delete('/:projectId', async (req, res) => {
    try {
        const {projectId} = req.params
        if (!isValidObjectId(projectId)) return res.status(400).send({err: "projectId is invalid"})
        await Promise.all([
            Project.deleteOne({_id: projectId}),
            Notice.deleteMany({project: projectId}),
            Comment.deleteMany({project: projectId}),
            Task.deleteMany({project: projectId}),
        ])
        return res.send({result: 'successful delete project'})
    } catch (err) {
        console.error(err)
    }
})

// api 프로젝트 나가기
projectRouter.put('/getout/:projectId', async (req, res) => {
    try {
        const {projectId} = req.params
        if (!isValidObjectId(projectId)) return res.status(400).send({err: "projectId is invalid"})

        const email = await verifyToken(req.headers.authorization).email
        const project = await Project.findOne({_id: projectId})

        project.memberList = project.memberList.filter(memberList => memberList !== email)
        project.save()

        return res.send({result: 'successful get out project'})
    } catch (err) {
        console.error(err)
    }
})

module.exports = {
    projectRouter
}