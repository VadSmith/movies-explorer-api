const isObjectIdExists = (MongoModel, ObjectId) => {
  if (MongoModel.findById(ObjectId).count() > 0) {
    return true;
  }
  return false;
};

const urlRegexp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

module.exports = {
  isObjectIdExists,
  urlRegexp,
};
