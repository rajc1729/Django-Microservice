import { setCookie, getCookie } from "./cookie";
import Router from "next/router";
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
 * @param {IUserRegister} userData - User's registration information
 */
export const signUpApiCall = async (userData: registerUser) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();

  Object.keys(userData).forEach((key) => {
    urlencoded.append(key, userData[key]);
  });
  // urlencoded.append("username", userData.username);
  // urlencoded.append("email", userData.email);
  // urlencoded.append("password1", userData.password1);
  // urlencoded.append("password2", userData.password2);
  // urlencoded.append("first_name", userData.first_name);
  // urlencoded.append("last_name", userData.last_name);
  // urlencoded.append("address1", userData.address1);
  // urlencoded.append("address1", userData.address2);
  // urlencoded.append("city", userData.city);
  // urlencoded.append("country", userData.country);
  // urlencoded.append("latitude", userData.latitude);
  // urlencoded.append("longitude", userData.longitude);
  // urlencoded.append("type", userData.type);
  // urlencoded.append("company_name", userData.company_name);

  // urlencoded.append("username", "ari2");
  // urlencoded.append("email", "ari2@outl.com");
  // urlencoded.append("password1", "Hello@123");
  // urlencoded.append("password2", "Hello@123");
  // urlencoded.append("first_name", "ari");
  // urlencoded.append("last_name", "naan");
  // urlencoded.append("address1", "20404");
  // urlencoded.append("address1", "g44");
  // urlencoded.append("city", "fullerton");
  // urlencoded.append("country", "US");
  // urlencoded.append("latitude", "37.8199");
  // urlencoded.append("longitude", "122.4783");
  // urlencoded.append("type", "employee");
  // urlencoded.append("company_name", "csuf1");

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

// export const getProfile = (accessToken) => {
//   const url = `${apiBaseUrl.url}profile/`;
//   var myheaders = new Headers();
//   myheaders.append("Authorization", "Bearer " + accessToken);
//   const requestOptions = {
//     method: "GET",
//     headers: myheaders,
//   };
//   // console.log("fetchhhhhhhhhhhhhhhhhh")
//   return fetch(url, requestOptions)
//     .then((res) => {
//       if (res.status === 200) {
//         return res.json();
//       } else {
//         throw res;
//       }
//     })
//     .catch((error) => {
//       return error.json();
//     });
// };

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
      // console.log(result);
      setCookie("access_token", result.access, addMinutes(new Date(), 1440)); //1 day
      return result;
    })
    .catch((error) => {
      // console.log(error);
      return { error: error.json() };
    })
    .then((result) => {
      return result;
    });
};
