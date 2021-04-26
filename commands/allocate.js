const funcall = require("../modules/funcall.js");
const strifecall = require("../modules/strifecall.js");

//used to allocate a weaponkind to the strife specibus

exports.summary = `allocate an unallocated strife specibus`;
exports.description = prefix=>`The allocate command is used to allocate an unallocated STRIFE SPECIBUS to the weaponkind of the selected item. This must be used before equipping items to the specibus.
${prefix}allocate [item position in sylladex]`;
exports.run = (client, message, args) => {

  if(funcall.regTest(client, message, message.author) == false){
    message.channel.send("You're not a registered player!");
    return;
  }

  if(strifecall.strifeTest(client, message, message.author) == true){
    message.channel.send("You can't do that in Strife! You need to either win the Strife or leave Strife using Abscond!");
    return;
  }

  //declare important variables

  var charid = client.playerMap.get(message.guild.id.concat(message.author.id),"control");

  let sdex = client.playerMap.get(charid,"sdex");
  let cards = client.playerMap.get(charid,"cards");

  let kinds = client.playerMap.get(charid,"kinds");
  let port = client.playerMap.get(charid,"port");

  //check if the list kinds is already greater than or equal to the amount of specibi a player has in their portfolio

  if(kinds.length >= port){
    message.channel.send(`All of your STRIFE SPECIBI are already allocated!`);
    return;
  };

  //check for second argument

  if(!args[0]){
    message.channel.send(`You need to select an item from your sylladex to allocate! You can see a full list of items in your sylladex with ${client.auth.prefix}sylladex. Allocate an item using the position number in the sylladex, for example: ${client.auth.prefix}allocate 3`);
    return;
  }

//convert argument into number

  selectDex = parseInt(args[0], 10) - 1;
  if(isNaN(selectDex)){

    message.channel.send("That is not a valid argument!");
    return;
  }


//check if argument is an item in sylladex

  if(selectDex >= cards || selectDex< 0 || selectDex >= sdex.length){
    message.channel.send(`That is not a valid item! Check the list of items in your Sylladex with ${client.auth.prefix}sylladex`);
    return;
  }

  let weaponkind = client.kind[client.codeCypher[0][client.captchaCode.indexOf(sdex[selectDex][1].charAt(0)) /*-1*/  ]];

//checks for blacklisted weaponkinds

  if(client.weaponkinds[weaponkind].t == 3){
    message.channel.send("That is an invalid weaponkind!");
    return;
  };

//checks to see if weaponkind is already allocated

  if(kinds.includes(weaponkind)==true){
    message.channel.send("That weaponkind is already allocated!");
  }

//push weaponkind into specibus list

  kinds.push(weaponkind);

  client.playerMap.set(charid,kinds,"kinds");
  message.channel.send(`Successfully allocated specibus to ${weaponkind}!`)
}
