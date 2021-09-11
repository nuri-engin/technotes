const parseJwt = require('./parseJwt');

const calculateJwtExp = (token) => {
    if(token !== null || token !== undefined){
        const decodedJwtToken = parseJwt(token);
        const date = new Date(0);

        date.setUTCSeconds(decodedJwtToken.exp);

        return date;
       }

       return null;
};

module.exports = calculateJwtExp;