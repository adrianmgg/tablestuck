const pageSize = 10; // number of commands per page

// TODO needs summary
exports.helpCategories = [];
exports.description = prefix=>`List help categories.
\`${prefix}help\`

List commands in specified category with short description of each.
\`${prefix}help category [category name]\`
\`${prefix}help category [category name] [page number]\`

Shows full description for a given command.
\`${prefix}help command [command name]\``;
exports.run = (client, message, args) => {
  if(args.length === 0) {
    let categoriesList = Object.keys(client.helpCategories).filter(c=>{
      switch(c){
        case 'dm': return client.funcall.dmcheck(client,message);
        case 'dev': return false;
        default: return true;
      }
    });
    message.channel.send(`help categories:
${categoriesList.join(', ')}
do \`${client.auth.prefix}help category [category name]\` to get a list of commands in that category and a summary of what each command does`);
    return;
  }
  
  const subcommand = args[0].toLowerCase();
  if(subcommand === 'category') {
    if(args.length < 2 || args.length > 3) {
      message.channel.send('invalid arguments'); // TODO better error message
      return;
    }
    let pageNum = 1;
    // optional page number argument
    if(args.length > 2) {
      pageNum = parseInt(args[2], 10);
      if(isNaN(pageNum)) {
        message.channel.send(`invalid page number "${args[2]}"`);
        return;
      }
    }
    
    let categoryName = args[1].toLowerCase();
    let categoryCommands = client.commands.keyArray().filter(c=>client.helpCategories[categoryName]?.has(c));
    let numPages = Math.ceil(categoryCommands.length / pageSize);
    if(pageNum < 1 || pageNum > numPages) {
        message.channel.send(`page number should be betwen 1 and ${numPages}`);
        return;
    }
    // index of first command in page
    let baseIdx = (pageNum - 1) * pageSize;
    let pageCommands = categoryCommands.slice(baseIdx, baseIdx + pageSize);
  
    // build a string with each line as either "command - summary" (if it has one)
    // or "command" if it has no summary
    let commandsList = pageCommands.map(name=>{
      let cmd = client.commands.get(name);
      if('summary' in cmd) return `${name} - ${cmd.summary}`;
      else return name;
    }).join('\n');
    message.channel.send(`**help - ${categoryName} - page ${pageNum} of ${numPages}**
${commandsList}
\`${client.auth.prefix}help category ${categoryName} [page number]\` to view a different page
\`${client.auth.prefix}help command [command name]\` to see a more detailed explanation of what that command does`);
  }
  else if(subcommand === 'command') {
    let commandName = args[1].toLowerCase();
    if(!client.commands.has(commandName)) {
      message.channel.send(`unknown command "${commandName}"`);
      return;
    }
    let command = client.commands.get(commandName);
    if('description' in command) {
      message.channel.send(command.description(client.auth.prefix));
      return;
    }
    else {
      message.channel.send("that command doesn't have a description yet");
      return;
    }
  }
  else {
    message.channel.send(`invalid subcommand\n${exports.description(client.auth.prefix)}`);
    return;
  }
}
