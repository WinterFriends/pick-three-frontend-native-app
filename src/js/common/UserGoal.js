import Goal from "./Goal";
import DateUtils from "./DateUtils";

class UserGoal {
    /**
     * 사용자 목표에 대한 클래스 반환
     * @param {string} date
     * @param {Goal} goal
     * @param {boolean} success
     * @param {string} diary
     */
    constructor(date, goal, success, diary) {
        this._dateString = date;
        this._date = DateUtils.formattedStringToDate(this._dateString);
        this._goal = goal;
        this._success = success;
        this._diary = diary;
    }

    getDate() {
        return this._dateString;
    }

    getGoal() {
        return this._goal.clone();
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
            goal: this._goal.toJson(),
            success: this._success,
            diary: this._diary
        }

        return json;
    }

    static fromJson(json) {
        let goal = Goal.fromJson(json.goal);
        let userGoal = new UserGoal(
            json.date,
            goal,
            json.success,
            json.diary
        )

        return userGoal;
    }

    clone() {
        let clone = new UserGoal(
            this._dateString,
            this._goal.clone(),
            this._success,
            this._diary
        )

        return clone;
    }
}

export default UserGoal;