import DateUtils from "../utils/DateUtils";

class UserGoal {
    /**
     * 사용자 목표에 대한 클래스 반환
     * @param {string} date
     * @param {int} goalId
     * @param {boolean} success
     * @param {string} diary
     */
    constructor(date, goalId, success, diary) {
        this._dateString = date;
        this._date = DateUtils.formattedStringToDate(this._dateString);
        this._goalId = goalId;
        this._success = success;
        this._diary = diary;
    }

    getDate() {
        return this._dateString;
    }

    getGoalId() {
        return this._goalId;
    }

    getSuccess() {
        return this._success;
    }

    getDiary() {
        return this._diary;
    }

    setSuccess(value) {
        this._success = value;
    }

    setDiary(value) {
        this._diary = value;
    }

    toJson() {
        let json = {
            date: this._dateString,
            goalId: this._goalId,
            success: this._success,
            diary: this._diary
        }

        return json;
    }

    static fromJson(json) {
        let userGoal = new UserGoal(
            json.date,
            json.goalId,
            json.success,
            json.diary
        )

        return userGoal;
    }

    clone() {
        let clone = new UserGoal(
            this._dateString,
            this._goalId,
            this._success,
            this._diary
        )

        return clone;
    }
}

export default UserGoal;