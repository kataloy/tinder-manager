const me = {
  id: process.env.ID,
  token: process.env.TOKEN,
};

const otherUserIds = [
  '5f98a21d6b01c8010090806f',
];

const otherUsers = otherUserIds.map((item) => ({
  id: item,
  matchId: `${me.id}${item}`,
}));

const messages = [
  'Привет',
  'Как дела?',
  'Хорошо\nЧем занимаешься?',
];

module.exports = {
  me,
  otherUserIds,
  otherUsers,
  messages,
};
