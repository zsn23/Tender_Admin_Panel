class LocalStorageService {

    persistInLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data))
    }

    getPersistedData = (key) => {
        var res = localStorage.getItem(key);
        res = JSON.parse(res)
        if (res == undefined || res == null || res == "") {
            return null
        }
        return res;
    }

    clear = () => {
        localStorage.clear()
    }
}

var localStorageService = new LocalStorageService();
export { localStorageService };