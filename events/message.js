const tourney = true;

module.exports = (client, message) => {
  //ignore all bots
  if(message.author.bot) return;

  if(message.guild === null) return;

  //Ignore all messages not starting with the prefix
  if(message.content.indexOf(client.auth.prefix) !== 0) return;

  var freeAct = ["register","leaderboard","stats","scratch","help","initialize","trait","act"];

  if(tourney){
    freeAct = ["register","leaderboard","stats","scratch","help","initialize","trait","heal","consume","act","strife","switch","specibus","sylladex","captcha","eject","alchemize","armor","trinket","equip","list","inspect","pass","quickalch","grist","ath","say","rename","use","allocate","push"];
  }

  //standard argument/command name definition
  const args = message.content.slice(client.auth.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  console.log(message.content);

  // Grab the command data from the client.commands Enmap
  const cmd = client.commands.get(command);
  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;
  try{
    let charid = message.guild.id.concat(message.author.id);

    let reg = false;

    if(client.playerMap.has(charid)){
      if(client.playerMap.get(charid,"alive")){
        reg=true;
      }
    }

    if(!reg&&command!="register"&&command!="help"&&command!="initialize"&&command!="scratch"&&command!="leaderboard"&&command!="config"){
      message.channel.send("You are not registered! Register using the >register command!");
      return;
    }

    if(client.playerMap.get(charid,"act")>=client.limit&&client.limit!=0&&!freeAct.includes(command)&&!client.funcall.dmcheck(client,message)){
      message.channel.send("You have reached your maximum number of actions for this tournament!");
      return;
    }
  } catch(err){
 console.log("A player took an action when not reigistered, probably the DM. Mostly good to ignore.");
  }
  if (client.limit != 0) {
	 client.user.setActivity("PESTERCORD TOURNAMENT");
  } else {
    client.user.setActivity("PESTERCORD");
  }
  // Run the command
  cmd.run(client, message, args);
};
