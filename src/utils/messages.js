exports.genMessage = (text, name, id, time = new Date().getTime()) => {
  return {
    text,
    name,
    id,
    createdAt: time,
  };
};
