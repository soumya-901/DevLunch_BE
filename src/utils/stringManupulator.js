const crypto = require("node:crypto");

exports.isEmpty = (data) => {
  return (
    data == {} ||
    data == [] ||
    data == null ||
    data == undefined ||
    (typeof data == String && data.trim() == "")
  );
};

exports.generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};
