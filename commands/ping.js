const funcall = require("../modules/funcall.js");
//simple ping command to check if the bot is online.
const strifecall = require("../modules/strifecall.js");

exports.helpCategories = [];
exports.summary = `pongers!`;
exports.description = prefix=>`Pongers!
\`${prefix}ping\``;
exports.run = (client, message, args) => {

  message.channel.send("PONGERS");


}
