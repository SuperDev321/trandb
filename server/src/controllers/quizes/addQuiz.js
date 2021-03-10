const {Quizes} = require('../../database/models');

const addQuiz = async (req, res, next) => {
    try {
        const {question, answer} = req.body;
        console.log(question, answer)
        if(question && answer) {
            let result = await Quizes.create({question, answer});
            if(result) {
                res
                .status(201)
                .json({
                    message: 'success'
                })
            } else {

            }
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
    
}

module.exports = addQuiz;