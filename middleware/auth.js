require('dotenv').config();

module.exports = (request, response, next) => {
    // fake checking auth. basicly need some 'Authentication: Breare YUIRY!IYI!U#YTIUY#TIU!Y#TIU;' header constructed after authentication
    const user = (request.user)?request.user:{
        authenticated: true
    };
    // If not - go back home
    if(!user.authenticated) {
        response.json({
            "error": "Not authenticated"
        })
        return;
    }
    next();
}
