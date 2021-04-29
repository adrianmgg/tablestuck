const funcall = require("../modules/funcall.js");
//simple ping command to check if the bot is online.
const strifecall = require("../modules/strifecall.js");

//declare variables for how much BD and AV player gets from trinket
const tierBD = [[1,2],[1,4],[1,6],[1,8],[1,10],[1,12],[2,16],[2,20],[2,24],[3,30],[3,36],[4,40],[5,50],[6,60],[7,70],[8,80],[10,100]];
const tierAv = [1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
const tList = ["MELEE","RANGED","MAGIC","NA"];

exports.helpCategories = ['gear'];
exports.summary = `inspect or manage your trinket`;
exports.description = prefix=>`Lets you inspect, equip, or eject a trinket from your person. You can only have one equipped at a time, so choose wisely!

View Current Trinket
\`${prefix}trinket\`

Equip a Trinket from your Sylladex
\`${prefix}trinket equip [item #]\`

Eject your currently equipped Trinket
\`${prefix}trinket eject\``;
exports.run = (client, message, args) => {

  if(funcall.regTest(client, message, message.author) == false){
    message.channel.send("You're not a registered player!");
    return;
  }

  var charid = client.playerMap.get(message.guild.id.concat(message.author.id),"control");
  var trinket = client.playerMap.get(charid,"trinket");
  let name = client.playerMap.get(charid,"name");

//if no arguments, display currently equipped trinket

  if(!args[0]){

    if(trinket.length==0){

      let weaponkind = "N/A";
      let gristType = "artifact";
      let trait1 = "NONE";
      let trait2 = "NONE";

      msg = `**TIER -** 0  **  QTY -** 0\n**KIND - **${weaponkind.toUpperCase()}`;

      msg1 = `**TRAIT 1 -** ${trait1}\n\n**TRAIT 1 -** ${trait2}`;

      inspectItem = new client.Discord.MessageEmbed()
      .setTitle(`**NO TRINKET EQUIPPED**`)
      .addField(`**ITEM INFORMATION**`,msg)
      .addField(`**ITEM TRAITS**`,msg1)

      message.channel.send(inspectItem);

    } else {

      let weaponkind = client.kind[client.codeCypher[0][client.captchaCode.indexOf(trinket[0][1].charAt(0))]];
      let gristType = client.gristTypes[client.codeCypher[1][client.captchaCode.indexOf(trinket[0][1].charAt(1))]];
      let trait1 = client.traitList[client.captchaCode.indexOf(trinket[0][1].charAt(2))];
      let trait2 = client.traitList2[client.captchaCode.indexOf(trinket[0][1].charAt(3))];

      msg = `**TIER -** ${trinket[0][2]}  **  QTY -** ${trinket[0][3]}\n**KIND - **${weaponkind.toUpperCase()}`

      msg1 = `**TRAIT 1 -** ${trait1}\n\n**TRAIT 2 -** ${trait2}`;

      inspectItem = new client.Discord.MessageEmbed()
      .setTitle(`**${trinket[0][0]}**`)
      .addField(`**ITEM INFORMATION**`,msg)
      .addField(`**ITEM TRAITS**`,msg1)

      message.channel.send(inspectItem);

    }

    //if first argument is eject, eject trinket

  } else if(args[0]=="eject"){

    if(strifecall.strifeTest(client, message, message.author) == true){
      message.channel.send("You can't do that in Strife! You need to either win the Strife or leave Strife using Abscond!");
      return;
    }

    if(trinket.length==0){
      message.channel.send("You don't have any EQUIPPED TRINKET to EJECT!");
      return;
    }

    //defining player location to place ejected trinket in

    let local = client.playerMap.get(charid,"local");
    let land = local[4];
    let sec = client.landMap.get(land,local[0]);
    let area = sec[local[1]][local[2]];
    let room = area[2][local[3]];

    //creates variable called dropitem while removing ejected trinket from trinket data

    dropItem=trinket.splice(0,1)[0];

    //push ejected trinket into room inventory

    room[5].push(dropItem);
    sec[local[1]][local[2]][2][local[3]] = room;
    client.landMap.set(land,sec,local[0]);
    client.playerMap.set(charid,trinket,"trinket");

    message.channel.send("Ejecting TRINKET!")
    client.funcall.tick(client,message);

//if first argument is equip, equip selected trinket

  } else if(args[0]=="equip"){

    if(strifecall.strifeTest(client, message, message.author) == true){
      message.channel.send("You can't do that in Strife! You need to either win the Strife or leave Strife using Abscond!");
      return;
    }

    let sdex = client.playerMap.get(charid,"sdex");

    //if no second argument, cancel

    if(!args[1]){
      message.channel.send(`You must select TRINKET from your SYLLADEX to equip! See the items in your sylladex with ${client.auth.prefix}sylladex`)
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

    //if trinket is already equipped, cancel

    if(trinket.length>0){
      message.channel.send(`You already have trinket equipped! Unequip your currently equipped trinket using ${client.auth.prefix}trinket eject`);
      return;
    }

    //if selected item is not trinketkind, cancel command

      let weaponkind = client.kind[client.codeCypher[0][client.captchaCode.indexOf(sdex[selectDex][1].charAt(0)) /*-1*/  ]];

      if(weaponkind != "hatkind" && weaponkind != "shoekind" && weaponkind != "glasseskind") {
        message.channel.send(`You can only equip HATKIND, GLASSESKIND, or SHOEKIND items as trinkets!`);
        return;
      }

      //creates variable that pulls trinket out of sylladex and pushes it into trinket inv

      let equipItem = sdex.splice(selectDex,1)[0];
      trinket.push(equipItem);

      client.playerMap.set(charid,sdex,"sdex");
      client.playerMap.set(charid,trinket,"trinket");

      message.channel.send(`Successfully EQUIPPED the ${equipItem[0]}!`);
      client.funcall.tick(client,message);

  } else {
    message.channel.send(`That is not a valid argument! Valid arguments for ${client.auth.prefix}trinket are eject and equip!`)
  }


}
