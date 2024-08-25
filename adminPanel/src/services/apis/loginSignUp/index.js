console.log("current url ", window.location.host);
var url = window.location.host.split(":")[0];
console.log("url ", url);
var baseurl = "    var baseurl = window.location.protocol + "; //" + url;";

const userSignUpApi = (name, email, password) => {
  console.log(name, email, password, "api");
  let obj = {
    firstName: name,
    lastName: name,
    email: email,
    password: password,
    confirmPassword: password,
    facebookId: null,
    pictureUrl: null,
  };
  return fetch(
    // "http://blue.thelivechatsoftware.com/ChatAppApi/api/auth/authenticate",
    baseurl,
    {
      mode: "no-cors",
      method: "POST",
      headers: new Headers({
        "access-token": "pnqxdcABJPkKu0IvtjNvtWqD6iNUxqBaxivBrJwzUfNv4Nbq1S",
        "callback-url": "localhost:3000",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
      }),
      body: JSON.stringify(obj),
    }
  )
    .then((response) => {
      console.log("response:", response);
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
const userLoginApi = (email, password) => {
  console.log("at 33");
  console.log(email, password, "api");
  let obj = {
    email: email,
    password: password,
  };
  return fetch(
    // "http://blue.thelivechatsoftware.com/ChatAppApi/api/auth/authenticate",
    baseurl,
    {
      mode: "no-cors",
      method: "POST",
      headers: new Headers({
        "access-token": "pnqxdcABJPkKu0IvtjNvtWqD6iNUxqBaxivBrJwzUfNv4Nbq1S",
        "callback-url": "http://tender786.com/",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
      }),
      body: JSON.stringify(obj),
    }
  )
    .then((response) => {
      console.log("response:", response);
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
const userLogoutApi = (authToken) => {
  return fetch(
    // "http://blue.thelivechatsoftware.com/ChatAppApi/api/auth/logoff",
    baseurl,
    {
      mode: "no-cors",
      method: "POST",
      headers: new Headers({
        "access-token": "pnqxdcABJPkKu0IvtjNvtWqD6iNUxqBaxivBrJwzUfNv4Nbq1S",
        Authorization: `Bearer ` + btoa(authToken),
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
      }),
    }
  );
};

export { userSignUpApi, userLoginApi, userLogoutApi };
