require('dotenv').config();

module.exports = (request, response, next) => {
    // fake checking auth. basicly need some 'Authentication: Breare YUIRY!IYI!U#YTIUY#TIU!Y#TIU;' header constructed after authentication
    const user = (request.user)?request.user:{
        fraud: false
    };
    // If not - go back home
    if(user.fraud) {
        response.json({
            "error": "Fraud account"
        })
        return;
    }
    next();
}
