const funcall = require("../modules/funcall.js");
//simple ping command to check if the bot is online.
const strifecall = require("../modules/strifecall.js");


exports.helpCategories = ['inventory']; // it kinda is i guess? idk
exports.summary = `view your total number of grist`;
exports.description = prefix=>`Used to view your total number of GRIST.
\`${prefix}grist\``;
exports.run = (client, message, args) => {

  if(funcall.regTest(client, message, message.author) == false){
    message.channel.send("You're not a registered player!");
    return;
  }
  if(strifecall.strifeTest(client, message, message.author) == true){
    message.channel.send("You can't do that in Strife! You need to either win the Strife or leave Strife using Abscond!");
    return;
  }
  var charid = message.guild.id.concat(message.author.id);

  message.channel.send(funcall.gristCacheEmbed(client, charid));
  return;
}
