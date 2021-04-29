exports.helpCategories = ['customization'];
exports.summary = `set your profile's image`;
exports.description = prefix=>`Sets your profile's image. Keep it clean or we will obliterate you, thank you. This will be displayed when somone uses the ${prefix}check command on you, or you use the ${prefix}say command.
\`${prefix}pic [Image URL]\``;
exports.run = (client, message, args) => {

let pic = args[0];
client.playerMap.set(client.playerMap.get(message.guild.id.concat(message.author.id),"control"),pic,"img");
message.channel.send(`Set image url! Players can see this when they ${client.auth.prefix}check your character. If the image URL is broken, it and any character bio won't appear.`)

}
