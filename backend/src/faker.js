const faker = require("faker");
const {User, Project, Notice, Comment, Task} = require("./models");
const {hashPassword} = require("./utils/passwordUtils");

generateFakeData = async (userCount, projectsPerUser, noticesPerProject, commentsPerNotice, tasksPerProject) => {
    if (typeof userCount !== "number" || userCount < 1)
        throw new Error("userCount must be a positive integer");
    if (typeof projectsPerUser !== "number" || projectsPerUser < 1)
        throw new Error("projectsPerUser must be a positive integer");
    if (typeof noticesPerProject !== "number" || noticesPerProject < 1)
        throw new Error("noticesPerProject must be a positive integer");
    if (typeof commentsPerNotice !== "number" || commentsPerNotice < 1)
        throw new Error("commentsPerNotice must be a positive integer");
    if (typeof tasksPerProject !== "number" || tasksPerProject < 1)
        throw new Error("tasksPerProject must be a positive integer");
    const users = [];
    const projects = [];
    const notices = [];
    const comments = [];
    const tasks = [];
    console.log("Preparing fake data.");

    for (let i = 0; i < userCount; i++) {
        users.push(
            new User({
                // name: faker.name.findName(),
                // email: `email${i}@naver.com`,
                // password: await hashPassword('qw12QW!@')
                name: `${i}`,
                email: `${i}@${i}`,
                password: await hashPassword(`${i}`)
            })
        );
    }

    users.map((user) => {
        for (let i = 0; i < projectsPerUser; i++) {
            const tmpUsers = users.filter(item => item.email !== user.email)
            const count = Math.floor(Math.random() * (tmpUsers.length + 1))
            const memberList = [];
            for (let j = 0; j < count; j++) {
                const randomIndex = Math.floor(Math.random() * tmpUsers.length);
                memberList.push(tmpUsers.splice(randomIndex, 1)[0].email);
            }
            memberList.push(user.email)
            projects.push(
                new Project({
                    title: faker.lorem.word(),
                    type: faker.lorem.word(),
                    start: faker.date.between('2024-01-01', '2024-01-31'),
                    end: faker.date.between('2024-06-01', '2024-12-31'),
                    leader: user.email,
                    memberList,
                })
            );
        }
    });

    projects.map((project) => {
        for (let i = 0; i < noticesPerProject; i++) {
            let index = Math.floor(Math.random() * project.memberList.length);
            notices.push(
                new Notice({
                    title: faker.lorem.word(),
                    content: faker.lorem.sentences(),
                    name: users.filter(user => user.email === project.memberList[index])[0].name,
                    email: project.memberList[index],
                    project: project._id,
                })
            );
        }
    });

    notices.map((notice) => {
        for (let i = 0; i < commentsPerNotice; i++) {
            let index = Math.floor(Math.random() * projects.filter(project => project._id === notice.project._id)[0].memberList.length);
            comments.push(
                new Comment({
                    content: faker.lorem.sentence(),
                    name: users.filter(user => user.email === projects.filter(project => project._id === notice.project._id)[0].memberList[index])[0].name,
                    email: projects.filter(project => project._id === notice.project._id)[0].memberList[index],
                    notice: notice._id,
                    project: notice.project._id,
                })
            );
        }
    });

    projects.map((project) => {
        for (let i = 0; i < tasksPerProject; i++) {
            tasks.push(
                new Task({
                    title: faker.lorem.word(),
                    memo: faker.lorem.sentence(),
                    start: faker.date.between('2024-02-01', '2024-02-31'),
                    end: faker.date.between('2024-03-01', '2024-05-31'),
                    project: project._id,
                })
            );
        }
    });

    console.log("fake data inserting to database...");
    await User.insertMany(users);
    console.log(`${users.length} fake users generated!`);
    await Project.insertMany(projects);
    console.log(`${projects.length} fake projects generated!`);
    await Notice.insertMany(notices);
    console.log(`${notices.length} fake notices generated!`);
    await Comment.insertMany(comments);
    console.log(`${comments.length} fake comments generated!`);
    await Task.insertMany(tasks);
    console.log(`${tasks.length} fake tasks generated!`);
    console.log("COMPLETE!!");
};

module.exports = {generateFakeData};