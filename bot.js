const { Client, Intents, MessageEmbed} = require("discord.js");
const https = require("https");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const Config = require("./Config.json")
client.login(Config.TOKEN);

client.on('ready', () => {
	const data = [{
		name: "server",
		description: "Minecraftのサーバーのテータスを表示",
		options: [{
			type: "STRING",
			name: "ip",
			description: "サーバーのIP",
			required: true
		}]
	}];
	client.application.commands.set(data, '890861333229236254');
	console.log(`login!!(${client.user.tag})`);
});

client.on("interactionCreate", interaction => {
	if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === `server`) {
		interaction.deferReply()
		const server = interaction.options.getString(`ip`)
		const url = `https://mcstatus.snowdev.com.br/api/query/v3/${server}`
		const icon = `https://api.mcsrvstat.us/icon/${server}`
		console.log(server);
		https.get(url, res => {
			res.on("data", (url_text) => {
				const time = new Date()
				console.log(JSON.parse(url_text));
				if(JSON.parse(url_text).online == true){
					const motd = JSON.parse(url_text).motd.replace(/§./g,``);
					const minecraft_server_embed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle(server)
					.setDescription(`プレイヤー : ${JSON.parse(url_text).players_online}/${JSON.parse(url_text).max_players}`)
					.setThumbnail(icon)
					.addField(`${motd}`, `バージョン : ${JSON.parse(url_text).version}`, true)
					.setFooter( `${time.getFullYear()}年${time.getMonth()+1}月${time.getDate()}日 ${time.getHours()}時${time.getMinutes()}分`)
					interaction.editReply({ embeds: [minecraft_server_embed] });
				} else {
					const minecraft_server_embed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle(`${server}は見つかりませんでした`)
					.setFooter(`${time.getFullYear()}年${time.getMonth()+1}月${time.getDate()}日 ${time.getHours()}時${time.getMinutes()}分`)
					interaction.editReply({ embeds: [minecraft_server_embed] });
				}
			});
		})
	}
});