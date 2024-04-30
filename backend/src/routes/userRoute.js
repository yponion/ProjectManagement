const {Router} = require('express');
const userRouter = Router();
const {User, Notice, Comment, Task} = require('../models')
// const mongoose = require('mongoose');
const {hashPassword, checkPassword} = require('../utils/passwordUtils')
const {generateToken, verifyToken} = require('../utils/jwt');
const {Project} = require("../models/Project");

// api 회원가입
userRouter.post('/signup', async (req, res) => {
    try {

        let {name, email, password} = req.body;
        if (!name) return res.status(400).send({err: "name is required"});
        if (!email) return res.status(400).send({err: "email is required"});
        if (!password) return res.status(400).send({err: "password is required"});

        const existingUser = await User.findOne({email: email});
        if (existingUser) return res.status(200).send({result: "exist email"})

        const user = new User({
            name,
            email,
            password: await hashPassword(password),
        });
        await user.save();
        return res.send({result: "success"})
    } catch (err) {
        console.error(err);
        return res.status(500).send({err: err.message})
    }
})

// api 로그인
userRouter.post('/signin', async (req, res) => {
    try {
        const {email, password} = req.body
        if (!email) return res.status(400).send({err: "email is required"});
        if (!password) return res.status(400).send({err: "password is required"});

        const existingUser = await User.findOne({email});
        if (!existingUser) return res.status(200).send({result: "fail"})
        if (existingUser.password === null) return res.status(200).send({result: "fail"})
        if (!await checkPassword(password, existingUser.password)) return res.status(200).send({result: "fail"})

        const payload = {
            name: existingUser.name,
            email: existingUser.email,
        };
        const token = generateToken(payload);
        // verifyToken(token)// 인증

        return res.status(200).send({result: "success", token})
    } catch (err) {
        console.error(err);
        return res.status(500).send({err: err.message})
    }
})

// api user:{name, email}
userRouter.get('/info', async (req, res) => {
    try {
        const user = await verifyToken(req.headers.authorization)
        return res.send({user})
    } catch (err) {
        console.error(err)
    }
})

// api 비밀번호 수정
userRouter.put('/info', async (req, res) => {
    try {
        const {currentPassword, changePassword} = req.body
        if (!currentPassword) return res.status(400).send({err: 'currentPassword is required'})
        if (!changePassword) return res.status(400).send({err: 'changePassword is required'})

        const email = await verifyToken(req.headers.authorization).email
        const user = await User.findOne({email})
        if (!await checkPassword(currentPassword, user.password)) return res.status(200).send({result: "fail"})

        user.password = await hashPassword(changePassword)
        await user.save()

        return res.send({result: "success"})
    } catch (err) {
        console.error(err)
    }
})

// api 회원 탈퇴
userRouter.delete('/withdraw', async (req, res) => {
    try {
        const email = await verifyToken(req.headers.authorization).email
        const user = await User.findOne({email})

        // 해당 email은 재가입 안되게 놔두고, 이름과 password의 값을 null으로
        await Promise.all([
            user.name = null,
            user.password = null,
            Project.updateMany({memberList: email}, {$pull: {memberList: email}}),
        ])
        await user.save()

        // 본인이 리더인 프로젝트 삭제, 해당 프로젝트의 작업, 공지, 댓글 삭제
        const projectIds = await Project.find({leader: email}, {_id: 1})
        for (let i = 0; i < projectIds.length; i++) {
            await Promise.all([
                Project.deleteOne({_id: projectIds}),
                Notice.deleteMany({project: projectIds}),
                Comment.deleteMany({project: projectIds}),
                Task.deleteMany({project: projectIds}),
            ])
        }

        // notice와 comment에 내포된 name과 email을 null으로 변경
        await Promise.all([
            Notice.updateMany({email}, {$set: {email: null, name: null}}),
            Comment.updateMany({email}, {$set: {email: null, name: null}}),
        ])

        return res.status(200).send({msg: "successful withdraw"})
    } catch (err) {
        console.error(err)
    }
})

module.exports = {
    userRouter
}
