// generate simple verification code
var genCode = function generateCode(){
        return Math.random().toString(36).slice(-8);
    }

// private method
//function genToken(user) {
//    var expires = expiresIn(7); // 7 days
//    var token = jwt.encode({
//        exp: expires
//    }, require('../config/secret')());
//
//    return {
//        token: token,
//        expires: expires,
//        user: user
//    };
//}
//
//function expiresIn(numDays) {
//    var dateObj = new Date();
//    return dateObj.setDate(dateObj.getDate() + numDays);
//}


module.exports.genCode = genCode;