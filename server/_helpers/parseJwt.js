const parseJwt = (token) => {
    if(token !== null || token !== undefined){
        const base64String = token.split('.')[1];
        const buffer = Buffer.from(base64String,'base64').toString('ascii');
        const decodedValue = JSON.parse(buffer);

        return decodedValue;
       }

       return null;
};

module.exports = parseJwt;