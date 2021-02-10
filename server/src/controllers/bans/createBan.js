const { Bans } = require('../../database/models');
const { banByNameAndIp, validateIP } = require('../../utils');


const addBan = async (req, res, next) => {
  try {

    const { username, room, ip, fromIp, toIp } = req.body;
    
    if(ip) {
       await validateIP(ip); 
    } else {
        if(fromIp && toIp) {
            await validateIP(fromIp);
            await validateIP(toIp);
        }
    }
    console.log(fromIp, toIp)
    let result = await banByNameAndIp(room, username, ip, fromIp, toIp);

    if(result) {
      res
      .status(201)
      .json({ statusCode: 201, message: 'Ban has been created successfully'});
    } else {
      res.status(400)
      .json({error: 'Bad request', message: 'Can not create this ban'})
    }
    // await createBan({ username, room, ip, startIp, endIp });

    
  } catch (err) {
    next(err);
  }
};

module.exports = addBan;
