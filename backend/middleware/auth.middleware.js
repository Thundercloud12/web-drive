import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  
  
  const authHeader = req.header("Authorization");
  
  
  

  if ( !authHeader) {

    
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   req.id = decoded.id;           
   req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    
    res.status(401).json({ msg: "Invalid token" });
  }
};

export default authMiddleware;
