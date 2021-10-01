const main = require('./play.js')

module.exports = {
    name: 'disconnect',
    aliases: [ 'dc' ],
    description: 'Disconnect the Bot from the VC',
    async execute() {
        main.leavevc.execute();
    }
}