import { refreshTokenToAccessToken } from "./auth";

export function setCookie(cname, cvalue, expireTime?) {
  if (expireTime) {
    var expires = "expires=" + expireTime.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  } else {
    document.cookie = cname + "=" + cvalue + ";path=/";
  }
}

export function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  if (cname === "access_token") {
    // Only if access_token is null and cname is access_token
    // console.log("Access token did not exist!");
    // console.log("refresh_token", getCookie("refresh_token"));
    // if not sign-in (means no refresh token) then it will return null, else it will return access token
    getCookie("refresh_token") &&
      refreshTokenToAccessToken(getCookie("refresh_token"));
    return null;
  }
  return null;
}
