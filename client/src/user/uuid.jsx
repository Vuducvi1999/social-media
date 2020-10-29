export const uuid = () => {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
    c
  ) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

export const CalcTime = (createdAt) => {
  const length = (new Date() - new Date(createdAt)) / 86400000;
  if (length * 24 < 1)
    return Math.floor(length * 24 * 60).toString() + " minutes ago";
  if (length < 1) return Math.floor(length * 24).toString() + " hours ago";
  if (length < 30) return Math.floor(length).toString() + " days ago";
  if (length > 30) return Math.floor(length / 30).toString() + " months ago";
};
