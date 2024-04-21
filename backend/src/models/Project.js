const {Schema, model, Types: {ObjectId}} = require('mongoose')

const ProjectSchema = new Schema({
    title: {type: String, required: true}, // 프로젝트 제목
    type: {type: String, required: true}, // 프로젝트 종류
    start: {type: Date, required: true}, // 프로젝트 시작일
    end: {type: Date, required: true}, // 프로젝트 마감일
    leader: {type: String, required: true}, // 작성자
    memberList: [String], // 프로젝트 멤버 리스트
})

const Project = model('project', ProjectSchema)
module.exports = {Project}