const {verify} = require('jsonwebtoken')


//functie care valideaza jwt-ul (vede daca esti complet invalid sau malformat)
const validateToken = (req, res, next) => {
    const accessToken =  req.header("accessToken");
    //console.log(accessToken)
    if(!accessToken) return res.json({error: "User not logged in"})
    try{
        const validToken = verify(accessToken, "securedID");
        debugger;
        const first_name = validToken.first_name;
        const last_name = validToken.last_name;

        if(validToken){
            return next();
        }
    }catch(err){
        return res.json({error: err})
    }
}

module.exports = {validateToken};