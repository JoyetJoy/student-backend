const jwt = require('jsonwebtoken')


const verifyToken = async(req,res,next) => {
    try {

        const authHeader = req.header('Authorization');
        if(!authHeader) return res.status(401).json({msg:'Access denied,token is missing'})
        
        const token = authHeader.split(' ')[1]

        try {
        const verified = jwt.verify(token,process.env.JWT_SECRET)

        next()
    
        } catch (error) {
            console.log('Invalid token',error);
        }
            
    } catch (error) {
        console.log('Error in json token verification',error);
    }
}

module.exports = verifyToken