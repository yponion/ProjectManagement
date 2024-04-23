const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    } catch (err) {
        console.error(err);
    }
}

const checkPassword = (password, hash) => {
    try {
        return bcrypt.compare(password, hash)
    } catch (err) {
        console.error(err)
    }
}


module.exports = {hashPassword, checkPassword};