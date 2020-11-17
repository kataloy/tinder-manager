const axios = require('axios');
const ApiError = require('./errors/ApiError');
const config = require('./config');

module.exports = class Tinder {
  constructor() {}

  async api (endpoint, axiosData) {
    // todo: add axios.create
    // const instance = axios.create({
    //   baseURL: 'https://api.gotinder.com/',
    //   headers: {
    //     'x-auth-token': config.me.token,
    //     'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36',
    //     locale: 'ru',
    //   },
    //   data: axiosData,
    // })

    const axiosConfig = {
      headers: {
        'x-auth-token': config.me.token,
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36',
      },
    };

    try {
      const { data } = await axios.post(
        `https://api.gotinder.com/${endpoint}?locale=ru`,
        axiosData,
        axiosConfig,
      );

      if (data.error) {
        throw new ApiError(data.error);
      }

      return data;
    } catch (e) {
      console.error(e);
    }
  }

  async sendMessage(message, id, matchId) {
    const endpoint = `user/matches/${matchId}`

    const axiosData = {
      message,
      id,
    };

    return this.api(endpoint, axiosData);
  }

  async getUpdatedMatches(lastActivityDate = '') {
    const { matches } =  await this.api('updates', {
      last_activity_date: lastActivityDate,
      //last_activity_date: '2020-10-10T11:44:34.206Z',
    });

    return matches;
  }

  async getUpdatedGoalMatches() {
    const matches = await this.getUpdatedMatches();
    const otherUsersIds = config.otherUsers.map(item => item.id);

    return matches.filter(item => otherUsersIds.includes(item.person._id));
  }

  async generateMessage() {
    // todo: write
  }

  async shouldWrite(message, toMe, fromMe) {
    let hasHi = 0;
    let hasOk = 0;

    for (const item of toMe) {
      if (item.toLowerCase().includes('привет')) {
        hasHi++;
      }

      if (item.includes('Нормально') || item.includes('нормально')
        || item.includes('Хорошо') || item.includes('хорошо')) {
        hasOk++;
      }
    }

    console.log(fromMe);

    switch (message) {
      case config.messages.howAreYou:
        return !!hasHi && !fromMe.includes(config.messages.howAreYou);
      case config.messages.whatAreYouDoing:
        return !!hasOk && !fromMe.includes(config.messages.whatAreYouDoing);
    }
  }

  async getContentType(target) {
    const toMe = target.messages.filter(item => item.to === config.me.id);
    const fromMe = target.messages.filter(item => item.from === config.me.id);

    if (!toMe.length) return;

    const messagesToMe = toMe.map(item => item.message);
    const messagesFromMe = fromMe.map(item => item.message);

    if (await this.shouldWrite(config.howAreYou, messagesToMe, messagesFromMe))
      return config.howAreYou;
    if (await this.shouldWrite(config.whatAreYouDoing, messagesToMe, messagesFromMe))
      return config.whatAreYouDoing;
  }
}