const funcall = require("../modules/funcall.js");



exports.helpCategories = ['pester'];
exports.summary = `view and add players to your chumroll`;
exports.description = prefix=>`Used to view and add players to your CHUMROLL.

Doing the command with no arguments will send you a list of your CHUMS and their CHUMTAGS.
\`${prefix}chumroll\`

The argument **PAGE** can be used to select what page of your chumroll you are viewing if you have more than 10 chums
\`${prefix}chumroll page [page number]\`

The argument **ADD** followed by either a valid CHUMHANDLE or CHUMTAG will add that chum to your chumroll.
\`${prefix}chumroll add [chumhandle or chumtag]\``;
exports.run = async function(client, message, args) {

  if(client.funcall.regTest(client, message, message.author) == false){
    message.channel.send("You're not a registered player!");
    return;
  }

  var charid = message.guild.id.concat(message.author.id);
  var local = client.playerMap.get(charid,"local");
  var room = client.landMap.get(local[4],local[0])[local[1]][local[2]][2][local[3]];
  let chumroll = client.playerMap.get(charid,"chumroll");
  let blockroll = [];

  if(client.playerMap.has(charid,"block")){
    blockroll = client.playerMap.get(charid,"block");
    return;
  }
//registers the custom homestuck font
client.Canvas.registerFont("./miscsprites/fontstuck.ttf",{family:`fontstuck`});
client.Canvas.registerFont("./miscsprites/Courier Std Bold.otf",{family:`Courier Standard Bold`});


const canvas = client.Canvas.createCanvas(400,650);
const ctx = canvas.getContext('2d');






function applyText(canvas, msg){
let fontsize = 24
ctx.font = `bold ${fontsize}px Courier Standard Bold`;
   while (ctx.measureText(msg).width > 320){
ctx.font = `bold ${fontsize -= 2}px Courier Standard Bold`;
}
  return ctx.font;
}

//old code to generate the OG background
/*
ctx.beginPath();
ctx.rect(0,0,canvas.width,canvas.height);
ctx.fillStyle =`#ffb600`;
ctx.fill();
ctx.strokeStyle =`#fff700`;
ctx.lineWidth = 5;
ctx.strokeRect(0, 0, canvas.width, canvas.height);
//title text
ctx.font = `30px fontstuck`;
ctx.fontColor
ctx.fillStyle =`#ffffff`;
ctx.fillText("PESTERCORD 6.0",10,40);
//banner container
ctx.beginPath();
ctx.rect(10,50,375,100);
ctx.fillStyle = `#000000`;
ctx.fill();
ctx.lineWidth = 4;
ctx.strokeRect(10,50,375,100);
//banner img and text
const logo = await client.Canvas.loadImage(`./miscsprites/chumlogo.png`);
ctx.drawImage(logo,0,45,160,120);
ctx.fillStyle =`#ffffff`;
ctx.font = `14px fontstuck`;
ctx.fillText("CHAT CLIENT",190,105);

//Chumroll text and box
ctx.fillStyle =`#000000`;
ctx.font = `12px fontstuck`;
ctx.fillText("CHUMROLL:",20,170);
ctx.beginPath();
ctx.rect(10,175,375,400);
ctx.fillStyle = `#000000`;
ctx.fill();
ctx.lineWidth = 4;
ctx.strokeRect(10,175,375,400);
//all the chumhandles


//chumhandle text and box
ctx.fillStyle =`#000000`;
ctx.font = `12px fontstuck`;
ctx.fillText("MYCHUMHANDLE:",10,595);
ctx.beginPath();
ctx.rect(10,600,375,40);
ctx.fillStyle = `#000000`;
ctx.fill();
ctx.lineWidth = 4;
ctx.strokeRect(10,600,375,40);*/
let pagenumber = 0;
let pageMax = Math.ceil(chumroll.length/10);
let pageturn = false;
if(args[0]&&args[0]!="add"){
let value = parseInt(args[0], 10) - 1;
if(isNaN(value)){
  message.channel.send("That is not a valid page number!");
  return;
}

if(value > pageMax-1 || value < 0) {
  message.channel.send("That isn't a page on your chumroll!");
  return;
}
pagenumber=value;
pageturn = true;
}

const pesterbackground = await client.Canvas.loadImage(`./miscsprites/pestercord.png`);
const online = await client.Canvas.loadImage(`./miscsprites/CHUMMY.png`);
const offline = await client.Canvas.loadImage(`./miscsprites/IDLE.png`);
ctx.drawImage(pesterbackground,0,0,canvas.width,canvas.height);
ctx.fillStyle =`#000000`;
ctx.font = `12px fontstuck`;
ctx.fillText(`PAGE ${pagenumber+1}/${pageMax}`,300,170);
ctx.fillStyle =`#ffffff`;
ctx.font = `bold 24px Courier Standard Bold`;

ctx.fillText(`[${client.playerMap.get(charid,"chumtag")}]${client.playerMap.get(charid,"chumhandle")}`,60,628);
let plonline = client.traitcall.compTest(client,message,charid,room);
if(plonline[0]){
ctx.drawImage(online,15,605,32,32);
} else {
  ctx.drawImage(offline,15,605,32,32);
}

let targonline = [false,false];
for(let i=pagenumber*10;i<chumroll.length&&i<(pagenumber+1)*10;i++){
  let tag = i;
if(client.playerMap.has(chumroll[i],"chumtag")){
  tag = client.playerMap.get(chumroll[i],"chumtag");
}
ctx.font = applyText(canvas,`[${tag}]${client.playerMap.get(chumroll[i],"chumhandle")}`);

ctx.fillText(`[${tag}]${client.playerMap.get(chumroll[i],"chumhandle")}`,50,203+((i-(pagenumber*10))*40));

  targlocal = client.playerMap.get(chumroll[i],"local");
  targroom = client.landMap.get(targlocal[4],targlocal[0])[targlocal[1]][targlocal[2]][2][targlocal[3]];

targonline = client.traitcall.compTest(client,message,chumroll[i],targroom);
  if(targonline[0]){
    ctx.drawImage(online,15,179+((i-(pagenumber*10))*40),32,32);
  } else {
    ctx.drawImage(offline,15,179+((i-(pagenumber*10))*40),32,32);
  }

}

  if(!args[0]||pageturn){
    let attachment = new client.Discord.MessageAttachment(canvas.toBuffer(), 'pestercord.png');
    message.channel.send(attachment);
    return;
  }

  if(args[0]=="add"){

    let handleList = client.landMap.get(message.guild.id+"medium","handleList");

    if(!args[1]||args[1]=="page"){

      let page = 0;
      if(args[1]&&args[1]=="page"){
          page = parseInt(args[2], 10) - 1;
          if (isNaN(page)||page<0||page>Math.ceil(handleList.length/10)) {
            message.channel.send("That is not a valid argument!");
            return;
          }

      }

      let msg;

      for(let i=page*10;i<handleList.length&&i<(page+1)*10;i++){
        msg+=`**[${handleList[i][2]}] ${handleList[i][1]}**\n*${client.playerMap.get(handleList[i][0])}*\n\n`;
      }

      chumPrint = new client.Discord.MessageEmbed()
      .setTitle(`**SESSION CHUMHANDLES**`)
      .addField(`**PAGE**`,`**${page+1} / ${Math.ceil(handleList.length/10)}**`)
      .addField(`**CHUMHANDLE**`,msg)
      message.channel.send(chumPrint);
      return;
    }

    let h;
    let hcheck =false;
    for(h=0;h<handleList.length&&hcheck==false;h++){
      if(handleList[h][2].toLowerCase()==args[1].toLowerCase()||handleList[h][1].toLowerCase()==args[1].toLowerCase()){
        if(handleList[h][0]==charid){
          message.channel.send("You can't add yourself as a chum, dummy!");
          return;
        }
        if(chumroll.includes(handleList[h][0])){
          message.channel.send("You've already added that chum!");
          return;
        }
        chumroll.push(handleList[h][0]);
        message.channel.send(`Added ${handleList[h][1]} to your chumroll!`);
        hcheck =true;
        let targetChums = client.playerMap.get(handleList[h][0],"chumroll");
        if(!targetChums.includes(charid)){
          targetChums.push(charid);
          client.playerMap.set(handleList[h][0],targetChums,"chumroll");
        }
      }
    }
    if(!hcheck){
      message.channel.send("Couldn't find a chum with that handle in this session!");
      return;
    }
    client.playerMap.set(charid,chumroll,"chumroll");


  }

  if(args[0]=="block"){

    if(!args[1]){
      message.channel.send(`Please enter the tag of the chum you would like to block. ${client.auth.prefix}chumroll block EB`);
      return;
    }

    let tagList = [];
    for(let i=0;i<chumroll.length;i++){
      tagList.push(client.playermap.get(chumroll[i],"tag").toLowerCase());
    }

    if(tagList.includes(args[1].toLowerCase())){

      let targId = chumroll[tagList.indexOf(args[1].toLowerCase())]

      if(blockroll.includes(targId)){

        message.channel.send("Unblocking chum!");
        blockroll.splice(blockroll.indexOf(targId),1);
      }else{
        message.channell.send("Blocking chum!");
        blockroll.push(targId);
      }

      client.playerMap.set(charid,blockroll,"block");

    }else{
      message.channel.send("There is no player on your chumroll with that tag!");
      return;
    }

  }

}
