import Goal from "../common/Goal";

class GoalManager {
    static _goalList = [];
    static _goalById = {};
    static _isReady = false;

    static setGoalList(goalList) {
        let freezeGoalList = [];
        goalList.map(goal => freezeGoalList.push(Object.freeze(goal)));
        freezeGoalList = Object.freeze(freezeGoalList);

        this._goalList = freezeGoalList;

        let freezeGoalById = {};
        freezeGoalList.map(goal => { freezeGoalById[goal.getId()] = goal });
        freezeGoalById = Object.freeze(freezeGoalById);

        this._goalById = freezeGoalById;

        // ready
        this._isReady = true;
    }

    static getGoalList() {
        return this._goalList;
    }

    static getGoalById(id) {
        return this._goalById[id];
    }

    static isReady() {
        return this._isReady;
    }
}

export default GoalManager;