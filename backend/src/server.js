const express = require('express')
const app = express()
const {userRouter, projectRouter, noticeRouter, commentRouter, taskRouter} = require('./routes')
const mongoose = require('mongoose')
const {generateFakeData} = require('./faker')
// const cors = require('cors')

const server = async () => {
    try {
        const {MONGO_URI, FRONT_PORT, BACK_PORT} = process.env
        if (!MONGO_URI) throw new Error("MONGO_URI is required!!!")
        if (!BACK_PORT || !FRONT_PORT) throw new Error("PORT is required!!!")

        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected')

        app.use(express.json())
        // app.use(cors({
        //     origin: `http://localhost:${FRONT_PORT}` // 허용할 도메인
        // }))
        app.use('/api/user', userRouter)
        app.use('/api/project', projectRouter)
        app.use('/api/project/notice', noticeRouter)
        app.use('/api/project/comment', commentRouter)
        app.use('/api/project/task', taskRouter)

        app.listen(BACK_PORT, async () => {
            console.log(`server listening on port ${BACK_PORT}`)
            // generateFakeData(10, 10, 10, 10, 10)
        })
    } catch (err) {
        console.log(err)
    }
}

server()