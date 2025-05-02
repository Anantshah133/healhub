import jwt from 'jsonwebtoken'

// User Authentication middleware

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        console.log(token)
        if(!token){
            return res.json({success: false, message: "Not authorized Login...."});
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        console.log(tokenDecode);
        req.userId = tokenDecode.id;

        next();
    } catch (err) {
        console.log(err);
        res.json({success: false, message: err.message});
    }
}

export default authUser;