const {Router} = require('express');
const userRouter = Router();
const {User} = require('../models')
// const mongoose = require('mongoose');
const {hashPassword, checkPassword} = require('../utils/passwordUtils')
const {generateToken, verifyToken} = require('../utils/jwt');

// api 로그인
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

// api 회원가입
userRouter.post('/signin', async (req, res) => {
    try {
        const {email, password} = req.body
        if (!email) return res.status(400).send({err: "email is required"});
        if (!password) return res.status(400).send({err: "password is required"});

        const existingUser = await User.findOne({email: email});
        if (!existingUser) return res.status(200).send({result: "fail"})
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

// userRouter.post('/test', async (req, res) => {
//     try {
//         const {token} = req.body
//         if (!verifyToken(token)) return res.status(400).send({msg: "Invalid token"})
//         return res.status(200).send({msg: "success"})
//     } catch (err) {
//         console.error(err)
//     }
// })

module.exports = {
    userRouter
}
