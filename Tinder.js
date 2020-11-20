const axios = require('axios');
const config = require('./config');

module.exports = class Tinder {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.gotinder.com/',
      headers: {
        'x-auth-token': config.me.token,
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36',
      },
    });
  }

  sendMessage(match, message) {
    return this.api.post(`/user/matches/${match._id}`, {
      message,
      id: match.person._id,
    });
  }

  async sendGeneratedMessage(match) {
    const indexes = {};

    match.messages.forEach((message, messageIndex) => {
      if (message.from !== config.me.id) return;

      config.messages.forEach((template, templateIndex) => {
        if (message.message.toLowerCase() === template.toLowerCase()) {
          indexes[templateIndex] = {
            messageIndex,
            templateIndex,
          };
        }
      });
    });

    const reversedIndexes = [...Object.values(indexes)].reverse();
    const { templateIndex, messageIndex } = reversedIndexes.find(Boolean) || {};

    if (messageIndex === undefined) {
      return this.sendMessage(match, config.messages[0]);
    }

    if (templateIndex + 1 === config.messages.length) {
      console.log(`Already sent all messages to #${match.person._id} user`);
      return;
    }

    const nextMessage = match.messages[messageIndex + 1];

    if (!nextMessage) return;

    return this.sendMessage(match, config.messages[templateIndex + 1]);
  }

  async getMatches(lastActivityDate = null) {
    const { data } = await this.api.post('/updates', {
      last_activity_date: lastActivityDate,
    });

    return data.matches;
  }

  async getFilteredMatches() {
    const matches = await this.getMatches();

    return matches.filter((item) => config.otherUserIds.includes(item.person._id));
  }
};
