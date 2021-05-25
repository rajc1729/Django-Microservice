import { setCookie, getCookie } from "./cookie";
import { apiBaseUrl } from "../config/environment";
import { registerUser, UserModel } from "../models/types";

const setLoginCookies = (
  accessToken: string,
  refreshToken: string,
  user: UserModel
) => {
  setCookie("access_token", accessToken, addMinutes(new Date(), 1440)); //1 day
  setCookie("refresh_token", refreshToken, addDays(new Date(), 1)); //14 Days
  setCookie("username", user.username, addMinutes(new Date(), 1440));
  setCookie("email", user.email, addMinutes(new Date(), 1440));
  setCookie("uuid", user.id, addMinutes(new Date(), 1440));
  if (user.is_employer) {
    setCookie("role", "employer", addMinutes(new Date(), 1440));
  } else {
    setCookie("role", "employee", addMinutes(new Date(), 1440));
  }
};

/**
 * Login with username and password
 * @param {string} username - User's username
 * @param {string} password - User's password
 */
export const loginWithUsername = async (username: string, password: string) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("username", username);
  urlencoded.append("password", password);
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };
  return fetch(`${apiBaseUrl.url}/rest-auth/login/`, requestOptions)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then((result) => {
      setLoginCookies(result.access_token, result.refresh_token, result.user);
      return result;
    })
    .catch((error) => {
      return error.json();
    })
    .then((result) => {
      return result;
    });
};

/**
 * Register directly w/ sign up form
 * @param {UserModel} userData - User's registration information
 */
export const signUpApiCall = async (userData: registerUser) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();

  Object.keys(userData).forEach((key) => {
    urlencoded.append(key, userData[key]);
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };
  return fetch(`${apiBaseUrl.url}/rest-auth/registration/`, requestOptions)
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then((result) => {
      setLoginCookies(result.access_token, result.refresh_token, result.user);
      return result;
    })
    .catch((error) => {
      return error.json();
    })
    .then((result) => {
      return result;
    });
};

const addMinutes = (dt: Date, minutes: number) => {
  return new Date(dt.getTime() + minutes * 60000);
};

const addDays = (dt: Date, days: number) => {
  return new Date(dt.getTime() + days * 86400000);
};

export const refreshToken = () => {};

export function signOut() {
  setCookie("access_token", null, addMinutes(new Date(), -1440));
  setCookie("refresh_token", null, addDays(new Date(), -14));
  setCookie("username", null);
  setCookie("email", null);
  setCookie("uuid", null);
  setCookie("role", null);
}

export const refreshTokenToAccessToken = (refresh_token: string) => {
  if (refresh_token === null) {
    return null;
  }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("refresh", refresh_token);
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };
  return fetch(`${apiBaseUrl.url}/api/token/refresh/`, requestOptions)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then((result) => {
      setCookie("access_token", result.access, addMinutes(new Date(), 1440)); //1 day
      return result;
    })
    .catch((error) => {
      return { error: error.json() };
    })
    .then((result) => {
      return result;
    });
};
