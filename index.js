const runJob = require('./utils/runJob');
const Tinder = require('./Tinder');

const tinder = new Tinder();

runJob(async () => {
   const targets = await tinder.getUpdatedGoalMatches();

   for (let i = 0; i < targets.length; i++) {
     const content = await tinder.getContentType(targets[i]);

     console.log(content);

     if (!content) continue;

     console.log(await tinder.sendMessage(content, targets[i].person._id, targets[i].id));
   }
},1000 * 60 * 5);

