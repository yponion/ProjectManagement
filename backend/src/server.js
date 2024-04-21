const express = require('express')
const app = express()
const {userRouter, projectRouter} = require('./routes')
const mongoose = require('mongoose')
const {noticeRouter} = require("./routes/noticeRoute");
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

        app.listen(BACK_PORT, async () => {
            console.log(`server listening on port ${BACK_PORT}`)

        })
    } catch (err) {
        console.log(err)
    }
}

server()