exports.helpCategories = [];
exports.summary = `set the bio that will be displayed when someone checks your character`;
exports.description = prefix=>`The BIO command is used to set the bio that will be displayed when someone uses the ${prefix}check command on your character.
\`${prefix}bio [character description / backstory / whatever you want]\``;
exports.run = (client, message, args) => {

if(!args[0]){
  message.channel.send("Bio cannot be empty!");
  return;
}

  var charid = client.playerMap.get(message.guild.id.concat(message.author.id),"control");

  var i=0;
  var output ="";
  while(args[i]){
    if(args[i].includes("@")){
      args[i]=args[i].slice(args[i].indexOf("@")+1);
    }
    output = output + args[i]+" ";
    i++
  }
  output = output.slice(0,-1);

message.channel.send(`Saving Bio, players can see it using the ${client.auth.prefix}check command on you! Note, if the bio is too long, it won't appear!`);
client.playerMap.set(charid,output,"bio");

}
