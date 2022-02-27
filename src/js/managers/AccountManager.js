import UserProfile from "../common/UserProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiManager from "./ApiManager";

class AccountManager {
    static _isLogedin = false;
    static _tokenSet = {};

    /* Login */
    static _isLogin(bool) {
        this._isLogedin = bool ? true : false;
    }

    static async initLoginInfo(tokenSet) {
        try {
            this.setTokenSet(tokenSet);
            await this.saveTokenSet();

            // 정상 로그인 확인
            let accessToken = this.getAccessToken();
            if (accessToken == null) {
                console.log("LoginScreen.signIn: Login failed");
                return false;
            }

            // 프로필 저장
            let userProfile = await ApiManager.getUserProfile();
            this.setUserProfile(userProfile);
            await this.saveUserProfile();

            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
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
        if (!tokenSet.hasOwnProperty("access") || !tokenSet.hasOwnProperty("refresh")) {
            console.warn(`AccountManager.setTokenSet: Can't find accessToken or refreshToken`);
            return;
        }

        this._tokenSet = Object.freeze(tokenSet);
        this._isLogin(true);

        ApiManager.initAccessToken(this.getAccessToken());

        console.log(`AccountManager.setTokenSet: accessToken: OK!, refreshToken: OK!`);
    }

    static getTokenSet() {
        if (!this.isLogedin()) return null;
        return this._tokenSet;
    }

    static getAccessToken() {
        if (!this.isLogedin()) return null;
        return this.getTokenSet()["access"];
    }

    static getRefreshToken() {
        if (!this.isLogedin()) return null;
        return this.getTokenSet()["refresh"];
    }

    static isLogedin() {
        return this._isLogedin;
    }

    static logout() {
        this._tokenSet = {};
        AsyncStorage.setItem("tokenSet", JSON.stringify({}));
    }

    /* UserInfo */
    static _userProfile = new UserProfile();
    static _userInfo = {
        name: "",
        email: "",
        photo: ""
    };

    static setUserProfile(userProfile) {
        this._userProfile = userProfile;
    }

    static getUserProfile() {
        return this._userProfile;
    }

    static async loadUserProfile() {
        try {
            let jsonString = await AsyncStorage.getItem("userProfile");
            if (jsonString == null) return null;

            let json = JSON.parse(jsonString);

            let userProfile = UserProfile.fromJson(json);
            this.setUserProfile(userProfile);

            return userProfile;
        }
        catch (err) {
            console.log(err);
        }
    }

    static async saveUserProfile() {
        try {
            let jsonString = JSON.stringify(this._userProfile.toJson());
            return await AsyncStorage.setItem("userProfile", jsonString);
        }
        catch (err) {
            console.log(err);
        }
    }
}

export default AccountManager;