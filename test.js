function convertTime(minutes) {
  day = ~~(minutes / (60 * 24));
  minutes %= 60 * 24;
  hour = ~~(minutes / 60);
  minutes %= 60;
  str = "";
  str += day > 0 ? day + " day " : "";
  str += hour > 0 ? hour + " hour " : "";
  str += minutes > 0 ? minutes + " minutes " : "";
  return str;
}

console.log(convertTime(125413));
