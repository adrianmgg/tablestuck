exports.run = (client, message, args) => {
	if(args.length < 1) {
		message.channel.send("usage: >previewcode [captcha code] ([tier=int] [count=int] [card=int]) ([name=...])\ntier, count, and cardtype are optional and can be in any order, name is optional and must be last");
		return;
	}
	
	let code = args[0];
	let name = "";
	let tier = 1;
	let count = 1;
	let cardtype = 0;
	
	let capturingName = false;
	for(let i = 1; i < args.length; i++) {
		let arg = args[i];
		if(capturingName) {
			name += ' ';
			name += arg;
			continue;
		}
		let match = /^(tier|count|card|name)=(.*)$/.exec(arg);
		if(match === null) {
			message.channel.send("argument parsing failed");
			return;
		}
		if(match[1] === 'tier' || match[1] === 'count' || match[1] === 'card') {
			let num = parseInt(match[2], 10);
			if(isNaN(num)) {
				message.channel.send(`error on argument "${arg}", could not parse "${match[2]}" as int`);
				return;
			}
			switch(match[1]){
				case 'tier':
					tier = num;
					break;
				case 'count':
					count = num;
					break;
				case 'card':
					cardtype = num;
					break;
			}
		}
		else if(match[1] === 'name') {
			capturingName = true;
			name = match[2];
		}
	}
	
	if(code.length !== 8) {
		message.channel.send("invalid code");
		return;
	}

	(async function(){
		const attachment = await client.imgcall.inspect(client,message,args,cardtype,[name,code,tier,count,[]]);
		message.channel.send(attachment);
	})();
}