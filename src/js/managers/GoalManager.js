import Goal from "../common/Goal";

class GoalManager {
    static _goalList = [];
    static _goalIdList = [];
    static _goalById = {};
    static _isReady = false;

    static setGoalList(goalList) {
        this._goalList = [];
        this._goalIdList = [];
        this._goalById = {};

        goalList.map(goal => {
            let goalId = goal.getId();
            let freezedGoal = Object.freeze(goal);
            this._goalList.push(freezedGoal);
            this._goalIdList.push(goalId);
            this._goalById[goalId] = freezedGoal;
        });

        this._goalList = Object.freeze(this._goalList);
        this._goalIdList = Object.freeze(this._goalIdList.sort());
        this._goalById = Object.freeze(this._goalById);

        console.log(this._goalById);

        // ready
        this._isReady = true;
    }

    static getGoalList() {
        return this._goalList;
    }

    static getGoalById(id) {
        return this._goalById[id];
    }

    static getGoalIdList() {
        return this._goalIdList;
    }

    static isReady() {
        return this._isReady;
    }
}

export default GoalManager;