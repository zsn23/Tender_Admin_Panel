// import apisauce from "apisauce";

// class LoginService {

//   baseurl = 'http://localhost/';

//   const create = (baseURL = baseurl) => {
//     const api = apisauce.create({
//       baseURL,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       timeout: 30000,
//     });
//     const setAuth = (userAuth) =>
//       api.setHeader("Authorization", "Bearer " + userAuth);
//     const setBaseURL = (userAuth) => api.setBaseURL(userAuth);

//     const signIn = (user) => api.post("/accounts-system-scripts/login.php", user);

//     const logoff = (user) =>
//       api.post("/accounts-system-scripts/logoff.php", user);

//     const getAllEmpCompanies = (pageData) =>
//       api.post("get_companies_details.php", pageData);

//     return {
//       signIn,
//       setAuth,
//       setBaseURL,
//       logoff,
//       getAllEmpCompanies,
//     };
//   };

// }

// var loginService = new LoginService();
// export { loginService };