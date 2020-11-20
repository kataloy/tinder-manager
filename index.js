const runJob = require('./utils/runJob');
const Tinder = require('./Tinder');

const tinder = new Tinder();

runJob(async () => {
  const matches = await tinder.getFilteredMatches();

  for (const match of matches) {
    await tinder.sendGeneratedMessage(match);
  }

  console.log('Done!');
}, 1000 * 60 * 5);
