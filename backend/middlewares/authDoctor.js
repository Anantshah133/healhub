import jwt from 'jsonwebtoken'

// Doctor Authentication middleware

const authDoctor = async (req, res, next) => {
    try {
        const { dToken } = req.headers;
        // console.log(token)
        if(!dToken){
            return res.json({success: false, message: "Not authorized Login...."});
        }

        const tokenDecode = jwt.verify(dToken, process.env.JWT_SECRET);
        // console.log(tokenDecode);
        req.docId = tokenDecode.id;

        next();
    } catch (err) {
        console.log(err);
        res.json({success: false, message: err.message});
    }
}

export default authDoctor;