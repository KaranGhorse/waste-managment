const jwt = require('jsonwebtoken')
const userModel = require('../Models/userModel')


const isAuthenticated =  async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({
                success: false,
                message: "Authorization token is missing or invailid"
            })
        }
        console.log("something is here");
        
        const token = authHeader.split(" ")[1]
        let decoded;
        
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
            
        } catch (error) {
            
            if (error.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "The Session has expired"
                })
            }
            return res.status(400).json({
                success: false,
                message: "The Authentication faield"
            })
        }

        const user = await userModel.findById(decoded.id);
        
        if (!user) return res.status(400).json({ success: false, message: "user not found" });
        
        console.log("something is going from here");
        req.id = user._id;
        req.user = user
        next()

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }

}


const isAdmin =  (req,res,next)=>{
    try {
        if(req.user || req.user.role == 'admin')
            next()
        else return res.status(403).json({success:false, message:"Access denied Admin only!"})
    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}

module.exports = {isAuthenticated,isAdmin}