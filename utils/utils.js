// eslint-disable-next-line consistent-return
const isObjectIdExists = (MongoModel, ObjectId) => {
  if (MongoModel.findById(ObjectId).count() > 0) return true;
};

const urlRegexp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

module.exports = {
  isObjectIdExists,
  urlRegexp,
};
