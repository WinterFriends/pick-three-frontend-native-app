import Constant from "../common/Constant";
import Goal from "../common/Goal";
import UserGoal from "../common/UserGoal";
import UserProfile from "../common/UserProfile";
import AccountManager from "./AccountManager";

class ApiManager {
    static getFetchHeaders() {
        let options = {
            headers: {
                Authorization: `Bearer ${AccountManager.getAccessToken()}`,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            }
        };
        return options;
    }

    /**
     * winty에 구글로 로그인하는 함수
     * @param {string} idToken 
     * @returns tokenSet
     */
    static async loginByGoogle(idToken) {
        let wintyLoginUri = Constant.API_DOMAIN + "/login/google";
        let response = await fetch(wintyLoginUri, { headers: { "Authorization": idToken } });
        const tokenSet = await response.json();
        return tokenSet;
    }

    static async refreshToken(refreshToken) {
        let data = JSON.stringify({
            refresh: refreshToken
        });

        let options = {
            method: "POST",
            ...this.getFetchHeaders(),
            body: data
        };

        let uri = Constant.API_DOMAIN + "/token/f";
        let response = await fetch(uri, options);
        const tokenSet = await response.json();

        return tokenSet;
    }

    /**
     * 정의된 Goal을 불러오는 함수
     * @returns Goal이 들어있는 리스트
     */
    static async getGoalList() {
        let response = await fetch(Constant.API_DOMAIN + "/info/goal/list", this.getFetchHeaders());
        let goalListJson = await response.json();

        let goalList = [];
        for (let goalJson of goalListJson) {
            let goal = Goal.fromJson(goalJson);
            goalList.push(goal);
        }

        return goalList;
    }

    /**
     * 원하는 연속된 날짜들의 UserGoal을 불러오는 함수
     * @param {string} startDate 시작 날짜 (yyyy-mm-dd)
     * @param {number} dateCount 시작 날짜부터 가져올 날짜 개수
     * @param {list<string>} needColumn 필요한 컬럼 (success, diary)
     * @returns 키는 날짜(string)이고 값은 UserGoal 리스트인 객체
     */
    static async getUserGoalListByDate(startDate, dateCount, needColumn) {
        let data = JSON.stringify({
            startDate,
            dateCount,
            needColumn
        });

        let options = {
            method: "POST",
            ...this.getFetchHeaders(),
            body: data
        };

        let uri = Constant.API_DOMAIN + "/user/goal/detail/get";
        let response = await fetch(uri, options);
        let responseJson = await response.json();

        let userGoalListByDate = responseJson["userGoalList"];

        for (let date in userGoalListByDate) {
            let userGoalListJson = userGoalListByDate[date];
            let userGoalList = [];
            for (let userGoalJson of userGoalListJson) {
                let userGoal = UserGoal.fromJson(userGoalJson);
                userGoalList.push(userGoal);
            }

            userGoalListByDate[date] = userGoalList;
        }

        return userGoalListByDate;
    }

    /**
     * 선택된 날짜의 사용자 목표 내용을 서버에 전송하여 적용하는 함수
     * @param {string} date 
     * @param {list<UserGoal>} userGoalList 
     * @param {list<string>} updateColumn 
     * @returns response.status
     */
    static async setUserGoalDetailByDate(date, userGoalList, updateColumn) {
        let userGoalJsonList = [];

        userGoalList.map(userGoal => userGoalJsonList.push(userGoal.toJson()));

        let data = JSON.stringify({
            date,
            updateColumn,
            userGoalList: userGoalJsonList
        });

        let options = {
            method: "POST",
            ...this.getFetchHeaders(),
            body: data
        };

        let uri = Constant.API_DOMAIN + "/user/goal/detail/set";
        let response = await fetch(uri, options);
        let status = response.status;

        return status;
    }

    /**
     * 사용자 프로필(UserProfile)을 서버에서 가져오는 함수
     * @returns UserProfile
     */
    static async getUserProfile() {
        let response = await fetch(Constant.API_DOMAIN + "/user/profile", this.getFetchHeaders());
        let json = await response.json();

        console.log(json);

        let userProfile = UserProfile.fromJson(json.profile);

        return userProfile;
    }

    /**
     * 사용자 프로필(UserProfile)을 서버에 저장하는 함수
     * @param {UserProfile} userProfile 
     * @param {list<string>} updateColumn 
     */
    static async setUserProfile(userProfile, updateColumn) {
        userProfile = userProfile.toJson();

        let data = JSON.stringify({
            updateColumn,
            profile: userProfile
        });

        let options = {
            method: "POST",
            ...this.getFetchHeaders(),
            body: data
        };

        let uri = Constant.API_DOMAIN + "/user/profile";
        let response = await fetch(uri, options);
        let status = response.status;

        return status;
    }

    static async deleteAccount() {
        let options = {
            method: "POST",
            ...this.getFetchHeaders()
        };

        let uri = Constant.API_DOMAIN + "/user/delete";
        let response = await fetch(uri, options);
        let status = response.status;

        return status;
    }
}

export default ApiManager;