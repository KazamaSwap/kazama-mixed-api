const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");
const types = {
    AddMessage: [
        { name: 'sender', type: 'address' },
        { name: 'message', type: 'string' }
    ]   
}
const domain = {
    name: 'chat',
    version: '1',
    // chainId: 1,
    // verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
  };
module.exports.addMessage = async (req, res, next) => {
    try {
        const {sender, message, signature} = req.body;
      const usermessage = {
        type: 'EditUsername',
        sender,
        message
      }
      const signerAddr = await ethers.utils.verifyTypedData(domain, types['EditUsername'], usermessage, signature);
      if (signerAddr !== address) {
        return res.json({
          message: "Not Allowed"
        });
      }
        const data = await messageModel.create({
            message:{
                text: message
            },
            sender: sender,
        });

        if(data) return res.json({
            msg: "Message added successfully!"
        });
        return res.json({ 
            msg: "Failed to add message to DB"
        });

    } catch (err) {
        next(err);
    }
};
module.exports.getAllMessage = async (req, res, next) => {
    try {
        const messages = await messageModel.find().limit(25).sort({ updatedAt: -1 });

        const projectMessages = await Promise.all(messages.sort((a,b) => {
            return a.updatedAt.getTime() - b.updatedAt.getTime()
        }).map(async(msg)=>{
            const user = await userModel.findOne({ '_id' : msg.sender})
            return{
                message: msg.message.text,
                sender: user,
                updatedAt: msg.updatedAt
            };
        }));

        res.json(projectMessages);
    } catch (error) {
        next(error);
    }
};

