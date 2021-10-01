const main = require('./play.js');
module.exports = {
    name: 'queue',
    aliases: ['q'],
    description: "Get a list of the videos in the queue",
    async execute(Discord, client, msg, args) {
        const queue_titles = [];
        if (!main.queue) return msg.reply("**There is nothing in the Queue! Use** `!p or !play` **to start a Queue!**")
        if (!main.queue.get(msg.guild.id) || !main.queue.get(msg.guild.id).songs) return msg.reply("**There is nothing in the Queue! Use** `!p or !play` **to start a Queue!**")
        for (var i = 0; i <= main.queue.get(msg.guild.id).songs.length; i++) {
            if (!main.queue.get(msg.guild.id).songs[i]) {
                // Do Nothing
            } else {
                queue_titles.push(main.queue.get(i + '. ' + msg.guild.id).songs[i].title + '\n');
                if (i === (main.queue.get(msg.guild.id).songs.length - 1)) {
                    msg.reply(`**Queue: ** \n\`${queue_titles}\``);
                };
            }
        };
    }
};