import Goal from "../common/Goal";

class GoalManager {
    static _goalList = [];
    static _goalById = {};

    static setGoalList(goalList) {
        let freezeGoalList = [];
        goalList.map(goal => freezeGoalList.push(Object.freeze(goal)));
        freezeGoalList = Object.freeze(freezeGoalList);

        this._goalList = freezeGoalList;

        let freezeGoalById = {};
        freezeGoalList.map(goal => { freezeGoalById[goal.getId()] = goal });
        freezeGoalById = Object.freeze(freezeGoalById);

        this._goalById = freezeGoalById;
    }

    static getGoalList() {
        return this._goalList;
    }

    static getGoalById(id) {
        return this._goalById[id];
    }
}

GoalManager.setGoalList([
    new Goal(0, "일", "시간을 투자한 대가로 가치를 얻는 모든 활동", "일 아이콘"),
    new Goal(1, "수면", "하루의 30%를 차지하는 중요한 시간", "수면 아이콘"),
    new Goal(2, "가족", "태어난 가족, 선택한 가족이든 자신이 정의한 가족", "가족 아이콘"),
    new Goal(3, "건강", "신체적, 정신적 건강을 모두 포함하는 자기 관리", "건강 아이콘"),
    new Goal(4, "친구", "일, 가족 이외에 즐거움을 주는 모든 사람이나 활동", "친구 아이콘")
])

export default GoalManager;