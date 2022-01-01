import AsyncStorage from '@react-native-async-storage/async-storage';

class AccountManager {
    static _isLogedin = false;
    static _tokenSet = {};

    /* Login */
    static _isLogin(bool) {
        this._isLogedin = bool ? true : false;
    }

    static async saveTokenSet() {
        if (!this._tokenSet.hasOwnProperty("access") || !this._tokenSet.hasOwnProperty("refresh")) return null;

        try {
            return await AsyncStorage.setItem("tokenSet", JSON.stringify(this._tokenSet));
        }
        catch (err) {
            console.log(err);
        }
    }

    static async loadTokenSet() {
        try {
            let jsonString = await AsyncStorage.getItem("tokenSet");

            if (jsonString == null) {
                this._isLogin(false);
                return false;
            }

            let json = JSON.parse(jsonString);

            if (!json.hasOwnProperty("access") || !json.hasOwnProperty("refresh")) {
                this._isLogin(false);
                return false;
            }

            this._isLogin(true);
            this.setTokenSet(json);

            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    static setTokenSet(tokenSet) {
        this._tokenSet = Object.freeze(tokenSet);
        console.log(`AccountManager.setTokenSet: `, tokenSet);
    }

    static getTokenSet() {
        if (!this._isLogedin) return null;
        return this._tokenSet;
    }

    static getAccessToken() {
        if (!this._isLogedin) return null;
        return this.getTokenSet()["access"];
    }

    static getRefreshToken() {
        if (!this._isLogedin) return null;
        return this.getTokenSet()["refresh"];
    }

    static isLogedin() {
        return this._isLogedin;
    }

    static logout() {
        AsyncStorage.setItem("tokenSet", JSON.stringify({}));
    }

    /* UserInfo */
    static _userInfo = {
        name: "",
        email: "",
        photo: ""
    };

    static _setUserInfo(userInfo) {
        this._userInfo = Object.freeze(userInfo);
        console.log(`AccountManager._setUserInfo: `, userInfo);
    }

    static _updateUserInfo(key, value) {
        let newUserInfo = { ...this._userInfo, [key]: value };
        this._setUserInfo(newUserInfo);
    }

    static async saveUserInfo() {
        try {
            return await AsyncStorage.setItem("userInfo", JSON.stringify(this._userInfo));
        }
        catch (err) {
            console.log(err);
        }
    }

    static async loadUserInfo() {
        try {
            let jsonString = await AsyncStorage.getItem("userInfo");

            if (jsonString == null) return null;

            let json = JSON.parse(jsonString);

            this._setUserInfo(json);

            return json;
        }
        catch (err) {
            console.log(err);
        }
    }

    static setUserName(name) {
        this._updateUserInfo("name", name);
    }

    static setUserEmail(email) {
        this._updateUserInfo("email", email);
    }

    static setUserPhoto(photo) {
        this._updateUserInfo("photo", photo);
    }

    static getUserInfo() {
        return this._userInfo;
    }

    static getUserName() {
        return this._userInfo["name"];
    }

    static getUserEmail() {
        return this._userInfo["email"];
    }

    static getUserPhoto() {
        return this._userInfo["photo"];
    }
}

export default AccountManager;