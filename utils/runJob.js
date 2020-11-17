const runJob = async (cb, interval) => {
  try {
    await cb();
  } catch(error) {
    console.error(error);
  }

  setTimeout(() => {
    runJob(cb, interval)
  }, interval);
};

module.exports = runJob;