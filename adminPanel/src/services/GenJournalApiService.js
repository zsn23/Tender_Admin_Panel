import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { localStorageService } from "./LocalStorageService";
import _EventEmitter from "../constants/emitter";
import { Search } from "react-feather";

class GeneralJournalApiService {
  userData = [];
  userAuthToken = [];

  
  baseUrl = process.env.REACT_APP_API_BASE_URL + "accounts-system-scripts";

  constructor() {
    this.userData = this.getLoginUserData()
  }

  getLoginUserData = () => {
    var _userData = localStorageService.getPersistedData("USER_DETAILS")
    return _userData;
  }

  getLoginUserLocalData = () => {
    var _userLocalData = localStorageService.getPersistedData("USER_DETAILS")
    return _userLocalData?.accessToken;
  }

  isTokenValid = (response) => {
    if (response.status === 401) {
      localStorageService.clear();
      _EventEmitter.emit("onLogOut", "")
    }
    return response;
  }

  login = async (body) => {
    try {
      let res = await axios.post(this.baseUrl + "/login.php", body);
      return res
    }
    catch (e) {
      return null
    }
  }

  getJournalData = async (
    customerid,
    startdate,
    enddate
  ) => {
    // console.log("we are here")
    var formData = new FormData();

    formData.append("customerid", customerid);
    formData.append("startdate", startdate);
    formData.append("enddate", enddate);
    const response = await fetch(
      this.baseUrl + "/get_journal.php",
      {
        method: "POST",
        body: formData,
      }
    );
    const json = await response.json();
    return json;
  }
}

export const genJournalApiServices = new GeneralJournalApiService();
