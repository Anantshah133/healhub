import jwt from 'jsonwebtoken'

// Doctor Authentication middleware

const authDoctor = async (req, res, next) => {
    try {
        const { dtoken } = req.headers;

        if(!dtoken){
            return res.json({success: false, message: "Not authorized Login...."});
        }

        const tokenDecode = jwt.verify(dtoken, process.env.JWT_SECRET);
        req.docId = tokenDecode.id;

        next();
    } catch (err) {
        console.log(err);
        res.json({success: false, message: err.message});
    }
}

export default authDoctor;