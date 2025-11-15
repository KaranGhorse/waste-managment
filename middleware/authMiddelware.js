const jwt = require('jsonwebtoken')
const userModel = require('../Models/userModel');
const adminModel = require('../Models/adminModel');


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
        console.log(token);
        
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
        console.log(user);
        if (!user) return res.status(400).json({ success: false, message: "user not found" });
        
        console.log("something is going from here");
        req.id = user._id;
        req.user = user
        next()

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }

}


const isAdmin = async (req,res,next)=>{
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
        console.log(token);
        
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

        const admin = await adminModel.findById(decoded.id);
        console.log(admin);
        if (!admin) return res.status(400).json({ success: false, message: "admin not found" });
        
        console.log("something is going from here");
        req.admin = admin
        next()

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = {isAuthenticated,isAdmin}