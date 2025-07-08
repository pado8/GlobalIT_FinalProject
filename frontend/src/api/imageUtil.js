export function getProfileImgUrl(filename) {
  if (!filename) return "http://3.37.151.29:8080/images/baseprofile.png";
  return `http://3.37.151.29:8080/images/${filename}`;
}
