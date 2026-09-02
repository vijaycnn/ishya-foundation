const jwt = require('jsonwebtoken');
module.exports.login = function(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.status(401).send({ message: "Please Add token" });
  }else{
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      console.log(err)
      if (err){

        return res.status(403).send({ status:"error", message: "Invalid Token",invalid_token:1 });
      }
      //return res.sendStatus(403)
      // console.log(user)
      req.user = user

      next();
    })
  }
}
