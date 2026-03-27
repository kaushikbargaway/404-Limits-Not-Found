exports.validateProof = (data) => {
  const { taskId, userId, image, text } = data;

  if (!taskId || !userId) {
    return "Task ID and User ID are required";
  }

  if (!image && !text) {
    return "Either image or text proof must be provided";
  }

  return null;
};