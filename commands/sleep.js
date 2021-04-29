exports.helpCategories = [];
exports.summary = `fall asleep (or wake up?)`;
exports.description = prefix=>`Drift off to sleep, or wake up, depending on which body you currently occupy. Your alternate self will heal while you act as yourself (dream heals while waking and vice versa). Will eventually be one of two ways to heal, the other being CONSUMING food.
\`${prefix}sleep\``; // FIXME pretty sure this one might need to be updated? idk
exports.run = function(client, message, args) {

  if(client.strifecall.strifeTest(client, message, message.author) == true){
    message.channel.send(`You can't do that in Strife! You need to either win the Strife or leave Strife using Abscond!`);
    return;
  }
  let charid = message.guild.id.concat(message.author.id);
  if(client.playerMap.get(charid,"dreamvit")<1){
    message.channel.send(`You try to wake up, but your other self has less than 1 VITALITY! Every action you take as this self will heal your other self by 5 HP. Your other self currently has ${client.playerMap.get(charid,"dreamvit")} VITALITY.`);
    return;
  }
  let temp;
  let dreamSwitch=["local","vit","port","kinds","spec","modus","cards","scards","sdex","equip","trinket","armor"];
  for(let i=0;i<dreamSwitch.length;i++){

    temp =client.playerMap.get(charid,dreamSwitch[i])
    client.playerMap.set(charid,client.playerMap.get(charid,`dream${dreamSwitch[i]}`),dreamSwitch[i]);
    client.playerMap.set(charid,temp,`dream${dreamSwitch[i]}`);
  }

message.channel.send("You fall asleep, or are you waking up?");

}
