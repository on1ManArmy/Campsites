class ExpressError extends Error{
    constructor(message, statusCode){
        super(); //Calls functions of a objects parent.
        this.message = message;
        this.statusCode = statusCode;
    }

}

module.exports = ExpressError;