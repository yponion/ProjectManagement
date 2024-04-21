const {Router} = require('express');
const projectRouter = Router();
const {User, Project} = require('../models')
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

// // api 대시보드 리스트 가져오기
// projectRouter.get('/dashboard/:projectId/notice', async (req, res) => {
//     try {
//         const {projectId} = req.params
//         if (!projectId) return res.status(400).send({err: 'projectId is required'})
//
//         const project = await Project.findOne({_id: projectId})
//         await console.log(project)
//         // return res.send({project.})
//         // todo 대시보드 생성부터 ㄱㄱ
//     } catch (err) {
//         console.error(err)
//     }
// })

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

module.exports = {
    projectRouter
}