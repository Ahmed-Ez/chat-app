exports.genMessage = (text) => {
  return {
    text,
    createdAt: `${new Date().getHours()}:${new Date().getMinutes()}`,
  };
};
