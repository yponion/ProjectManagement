const {Router} = require('express')
const {isValidObjectId} = require("mongoose");
const {Task} = require("../models");
const taskRouter = Router()

taskRouter.post('/create/:projectId', async (req, res) => {
    const {projectId} = req.params
    if (!isValidObjectId(projectId)) return res.status(400).send({err: 'projectId is invalid'})
    const {title, memo, start, end} = req.body
    if (!title) return res.status(400).send({err: 'title is required'})
    if (!memo) return res.status(400).send({err: 'memo is required'})
    if (!start) return res.status(400).send({err: 'start is required'})
    if (!end) return res.status(400).send({err: 'end is required'})

    const task = new Task({
        title,
        memo,
        start,
        end,
        project: projectId,
    })
    task.save()
    return res.send({result: 'successful create task'})
})

taskRouter.get('/list/:projectId', async (req, res) => {
    const {projectId} = req.params
    if (!isValidObjectId(projectId)) return res.status(400).send({err: 'projectId is invalid'})
    const tasks = await Task.find({project: projectId})
    return res.send({tasks});
})

taskRouter.get('/:taskId', async (req, res) => {
    try {
        const {taskId} = req.params
        if (!isValidObjectId(taskId)) return res.status(400).send({err: 'taskId is invalid'})

        const task = await Task.findOne({_id: taskId})
        return res.send({task});
    } catch (err) {
        console.error(err)
    }
})

taskRouter.put('/edit/:taskId', async (req, res) => {
    try {
        const {taskId} = req.params
        if (!isValidObjectId(taskId)) return res.status(400).send({err: 'taskId is invalid'})
        const {title, memo, start, end} = req.body

        await Task.updateOne({_id: taskId}, {$set: {title, memo, start, end}})
        return res.send({result: 'successful edit task'});
    } catch (err) {
        console.error(err)
    }
})

taskRouter.delete('/delete/:taskId', async (req, res) => {
    try {
        const {taskId} = req.params
        if (!isValidObjectId(taskId)) return res.status(400).send({err: 'taskId is invalid'})

        await Task.deleteOne({_id: taskId})
        return res.send({result: 'successful edit task'});
    } catch (err) {
        console.error(err)
    }
})


module.exports = {taskRouter}