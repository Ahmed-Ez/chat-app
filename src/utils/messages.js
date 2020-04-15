exports.genMessage = (text, name, id) => {
  return {
    text,
    name,
    id,
    createdAt: `${new Date().getHours()}:${new Date().getMinutes()}`,
  };
};
