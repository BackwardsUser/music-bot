const main = require('./play.js')

module.exports = {
    name: 'forceskip',
    aliases: [ 'fs' ],
    description: 'Skip the currently playing song',
    async execute(Discord, client, msg, args) {
        if (!main.queue){
            msg.reply('**Thats weird... This server doesn\'t seem to have a queue, make one by playing a song with **`!p or !play`');
            return;
        }
        if (!main.queue.get(msg.guild.id)){
            msg.reply('**Thats weird... This server doesn\'t seem to have a queue, make one by playing a song with **`!p or !play`');
            return;
        }
        if (!main.queue.get(msg.guild.id).songs.length > 0){
            msg.reply('**There is nothing left in the Queue... Stopping the Player**')
            main.stopPlayer.execute();
            return
        }
        main.playSong.execute();
    }
}