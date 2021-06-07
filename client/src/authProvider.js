import { API_URL } from "./config";
// in src/authProvider.js
export default {
  // called when the user attempts to log in
  login: ({ email, password }) => {
    const request = new Request(`${API_URL}/auth`, {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", res.user);
      });

    // accept all username/password combinations
  },
  // called when the user clicks on the logout button
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return Promise.resolve();
  },
  // called when the API returns an error
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    return localStorage.getItem("token")
      ? Promise.resolve()
      : Promise.reject({ redirectTo: "/no-access" });
  },
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: () => {
    const role = localStorage.getItem("role");
    return role ? Promise.resolve(role) : Promise.reject();
  },
};
