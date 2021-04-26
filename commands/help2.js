const pageSize = 10; // number of commands per page

function helpPage(client, message, pageNum) {
  let allCommands = client.commands.keyArray();
  // TODO maybe should exclude the dm-only commands if user doesn't have that role?
  let numPages = Math.ceil(allCommands.length / pageSize);
  if(pageNum < 1 || pageNum > numPages) {
      message.channel.send(`page number should be betwen 1 and ${numPages}`);
      return;
  }
  // index of first command in page
  let baseIdx = (pageNum - 1) * pageSize;
  let pageCommands = allCommands.slice(baseIdx, baseIdx + pageSize);

  // build a string with each line as either "command - summary" (if it has one)
  // or "command" if it has no summary
  let commandsList = pageCommands.map(name=>{
    let cmd = client.commands.get(name);
    if('summary' in cmd) return `${name} - ${cmd.summary}`;
    else return name;
  }).join('\n')
  message.channel.send(`**help - page ${pageNum} of ${numPages}**
${commandsList}
${client.auth.prefix}help [page number] to view a different page, or ${client.auth.prefix}help [command name] to see a more detailed explanation`);
}

exports.description = ``;
exports.run = (client, message, args) => {
  if(args.length === 0) {
    helpPage(client, message, 1);
  }
  else if(args.length === 1) {
    // first, check if the argument is the name of a command
    let commandName = args[0].toLowerCase();
    let cmd = client.commands.get(commandName);
    if(cmd != null) {
      message.channel.send(`${client.auth.prefix}${commandName}
${'description' in cmd ? cmd.description(client.auth.prefix) : "command has no description :("}`);
      return;
    }
    // if it's not the name of a command, check if it's a page number
    let pageNum = parseInt(args[0]);
    if(!isNaN(pageNum)) {
      helpPage(client, message, pageNum);
      return;
    }
    // if it's not a command name or a page number, give the user an error message
    message.channel.send('TODO write an error message here'); // TODO
    return;
  }
}
