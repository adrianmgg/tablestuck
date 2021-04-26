const funcall = require("../modules/funcall.js");
//simple ping command to check if the bot is online.
const strifecall = require("../modules/strifecall.js");

//declare variables for how much BD and AV player gets from armor
const tierBD = [[1,2],[1,4],[1,6],[1,8],[1,10],[1,12],[2,16],[2,20],[2,24],[3,30],[3,36],[4,40],[5,50],[6,60],[7,70],[8,80],[10,100]];
const tierAv = [1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
const tList = ["MELEE","RANGED","MAGIC","NA"];

exports.summary = `view and manage your equipped armor`;
exports.description = prefix=>`The armor command is used to view and manage your equipped armor.

Doing the command with no arguments will display information about your currently equipped armor.
\`${prefix}armor\`

The argument **EJECT** will eject the currently equipped armor into the room.
\`${prefix}armor eject\`

The argument **EQUIP** can be used to equip an armorkind item from your sylladex.
\`${prefix}armor equip [item position in sylladex]\``;
exports.run = (client, message, args) => {

  if(funcall.regTest(client, message, message.author) == false){
    message.channel.send("You're not a registered player!");
    return;
  }

  var charid = client.playerMap.get(message.guild.id.concat(message.author.id),"control");
  var armor = client.playerMap.get(charid,"armor");
  let name = client.playerMap.get(charid,"name");

//if no arguments, display currently equipped armor
 
  if(!args[0]){

    if(armor.length==0){

      let weaponkind = "N/A";
      let gristType = "artifact";
      let trait1 = "NONE";
      let trait2 = "NONE";

      msg = `**TIER -** 0  **  QTY -** 0\n**KIND - **${weaponkind.toUpperCase()} **TYPE -** N/A\n\n**GRIST TYPE -** ${
        client.emojis.cache.get(client.grist[gristType].emoji)} ${gristType.toUpperCase()}\n**EFFECTIVE -** ${
        client.emojis.cache.get(client.grist[client.grist[gristType].effective[0]].emoji)}${client.emojis.cache.get(client.grist[client.grist[gristType].effective[1]].emoji)}${client.emojis.cache.get(client.grist[client.grist[gristType].effective[2]].emoji)}${client.emojis.cache.get(client.grist[client.grist[gristType].effective[3]].emoji)
        }\n**INEFFECTIVE -** ${
        client.emojis.cache.get(client.grist[client.grist[gristType].ineffective[0]].emoji)}${client.emojis.cache.get(client.grist[client.grist[gristType].ineffective[1]].emoji)}${client.emojis.cache.get(client.grist[client.grist[gristType].ineffective[2]].emoji)}${client.emojis.cache.get(client.grist[client.grist[gristType].ineffective[3]].emoji)
        }`;

      msg1 = `**TRAIT 1 -** ${trait1}\n\n**TRAIT 1 -** ${trait2}`;

      inspectItem = new client.Discord.MessageEmbed()
      .setTitle(`**NO ARMOR EQUIPPED**`)
      .addField(`**ITEM INFORMATION**`,msg)
      .addField(`**ITEM TRAITS**`,msg1)
      .addField(`**PROTECTION**`,`**AV -** 1 **BR -** 1d2`);

      message.channel.send(inspectItem);

    } else {

      let weaponkind = client.kind[client.codeCypher[0][client.captchaCode.indexOf(armor[0][1].charAt(0))]];
      let gristType = client.gristTypes[client.codeCypher[1][client.captchaCode.indexOf(armor[0][1].charAt(1))]];
      let trait1 = client.traitList[client.captchaCode.indexOf(armor[0][1].charAt(2))];
      let trait2 = client.traitList2[client.captchaCode.indexOf(armor[0][1].charAt(3))];

      msg = `**TIER -** ${armor[0][2]}  **  QTY -** ${armor[0][3]}\n**KIND - **${weaponkind.toUpperCase()} **TYPE -** ${tList[client.weaponkinds[weaponkind].t]}\n\n**GRIST TYPE -** ${
        client.emojis.cache.get(client.grist[gristType].emoji)} ${gristType.toUpperCase()}\n**EFFECTIVE -** ${
        client.emojis.cache.get(client.grist[client.grist[gristType].effective[0]].emoji)}${client.emojis.cache.get(client.grist[client.grist[gristType].effective[1]].emoji)}${client.emojis.cache.get(client.grist[client.grist[gristType].effective[2]].emoji)}${client.emojis.cache.get(client.grist[client.grist[gristType].effective[3]].emoji)
        }\n**INEFFECTIVE -** ${
        client.emojis.cache.get(client.grist[client.grist[gristType].ineffective[0]].emoji)}${client.emojis.cache.get(client.grist[client.grist[gristType].ineffective[1]].emoji)}${client.emojis.cache.get(client.grist[client.grist[gristType].ineffective[2]].emoji)}${client.emojis.cache.get(client.grist[client.grist[gristType].ineffective[3]].emoji)
        }`;

      msg1 = `**TRAIT 1 -** ${trait1}\n\n**TRAIT 2 -** ${trait2}`;

      inspectItem = new client.Discord.MessageEmbed()
      .setTitle(`**${armor[0][0]}**`)
      .addField(`**ITEM INFORMATION**`,msg)
      .addField(`**ITEM TRAITS**`,msg1)
      .addField(`**PROTECTION**`,`**AV -** ${tierAv[armor[0][2]]} **BR -** ${tierBD[armor[0][2]][0]}d${tierBD[armor[0][2]][1]}`);

      message.channel.send(inspectItem);

    }

    //if first argument is eject, eject armor

  } else if(args[0]=="eject"){

    if(client.strifecall.strifeTest(client, message, message.author) == true){
      message.channel.send("You can't do that in Strife! You need to either win the Strife or leave Strife using Abscond!");
      return;
    }

    if(armor.length==0){
      message.channel.send("You don't have any EQUIPPED ARMOR to EJECT!");
      return;
    }

    //defining player location to place ejected armor in

    let local = client.playerMap.get(charid,"local");
    let land = local[4];
    let sec = client.landMap.get(land,local[0]);
    let area = sec[local[1]][local[2]];
    let room = area[2][local[3]];

    //creates variable called dropitem while removing ejected armor from armor data

    dropItem=armor.splice(0,1)[0];

    //push ejected armor into room inventory

    room[5].push(dropItem);
    sec[local[1]][local[2]][2][local[3]] = room;
    client.landMap.set(land,sec,local[0]);
    client.playerMap.set(charid,armor,"armor");

    client.funcall.tick(client,message);

    message.channel.send("Ejecting Armor!")

//if first argument is equip, equip selected armor

  } else if(args[0]=="equip"){

    if(client.strifecall.strifeTest(client, message, message.author) == true){
      message.channel.send("You can't do that in Strife! You need to either win the Strife or leave Strife using Abscond!");
      return;
    }

    let sdex = client.playerMap.get(charid,"sdex");

    //if no second argument, cancel

    if(!args[1]){
      message.channel.send(`You must select ARMOR from your SYLLADEX to equip! See the items in your sylladex with ${client.auth.prefix}sylladex`)
      return;
    }

    //converts argument 2 to number

    selectDex = parseInt(args[1], 10) - 1;
    if(isNaN(selectDex)){

      message.channel.send("That is not a valid argument!");
      return;
    }
    if(selectDex >= sdex.length || selectDex< 0){
      message.channel.send(`That is not a valid item! Check the list of items in your Sylladex with ${client.auth.prefix}sylladex`);
      return;
    }

    //if armor is already equipped, cancel

    if(armor.length>0){
      message.channel.send(`You already have ARMOR equipped! Unequip your currently equipped armor using ${client.auth.prefix}armor eject`);
      return;
    }

    //if selected item is not armorkind, cancel command

      let weaponkind = client.kind[client.codeCypher[0][client.captchaCode.indexOf(sdex[selectDex][1].charAt(0)) /*-1*/  ]];

      if(weaponkind !== "armorkind") {
        message.channel.send(`You can only equip ARMORKIND items as ARMOR!`);
        return;
      }

      //creates variable that pulls armor out of sylladex and pushes it into armor inv

      let equipItem = sdex.splice(selectDex,1)[0];
      armor.push(equipItem);

      client.playerMap.set(charid,sdex,"sdex");
      client.playerMap.set(charid,armor,"armor");

      client.funcall.tick(client,message);

      message.channel.send(`Successfully EQUIPPED the ${equipItem[0]}!`);

  } else {
    message.channel.send(`That is not a valid argument! Valid arguments for ${client.auth.prefix}armor are eject and equip!`)
  }


}
