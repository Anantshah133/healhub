import jwt from 'jsonwebtoken'

// Admin Authentication middleware

const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers;
        console.log(atoken)
        if(!atoken){
            return res.json({success: false, message: "Not authorized Login...."});
        }

        const tokenDecode = jwt.verify(atoken, process.env.JWT_SECRET);
        if(tokenDecode != (process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD)){
            return res.json({success: false, message: "Not authorized Login...."});
        }

        next();
    } catch (err) {
        console.log(err);
        res.json({success: false, message: err.message});
    }
}

export default authAdmin;