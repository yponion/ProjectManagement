const jwt = require('jsonwebtoken'); // jwt 모듈 불러오기
const secretKey = process.env.SECRET_KEY;

const generateToken = (payload) => {
    try {
        return jwt.sign(payload, secretKey, {expiresIn: '1h'});
    } catch (err) {
        console.error(err)
    }
};

const verifyToken = (token) => {
    try {
        if (!token.includes(' ')) return jwt.verify(token, secretKey)
        else {
            const tmp = token.split(' ')
            return jwt.verify(tmp[1], secretKey)
        }
    } catch (err) {
        console.log(err)
    }
};

module.exports = {generateToken, verifyToken};