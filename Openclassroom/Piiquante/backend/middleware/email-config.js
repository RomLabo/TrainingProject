const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

module.exports = (req, res, next) => {
    try {
        if (!emailRegex.test(req.body.email)) {
            throw 'Invalid model of email';
        } else {
            next();
        }    
    } catch {
        res.status(401).json({ message: 'Veuillez indiquer un email valide, ex: "johnDoe@example.com ."'});
    }
};