import UserGoal from "../common/UserGoal";

class UserGoalUtils {
    /**
     * 사용자 목표 리스트 중 성공한 Goal의 Id만 뽑아 리스트로 반환하는 함수
     * @param {list<UserGoal>} userGoalList
     * @returns 성공한 목표 아이디만 들어있는 리스트
     */
    static getSuccessGoalIdList(userGoalList) {
        let result = [];
        for (let userGoal of userGoalList) {
            let success = userGoal.getSuccess();
            if (success)
                result.push(userGoal.getGoalId());
        }
        result.sort();
        return result;
    }

    static getSelectedGoalIdList(userGoalList) {
        let result = [];
        for (let userGoal of userGoalList) {
            result.push(userGoal.getGoalId());
        }
        result.sort();
        return result;
    }

    /**
     * UserGoal 리스트를 Goal의 Id로 정렬해주는 함수
     * @param {list<UserGoal>} userGoalList
     * @returns 정렬된 UserGoal 리스트
     */
    static sortUserGoalListByGoalId(userGoalList) {
        return userGoalList.sort((userGoalA, userGoalB) => userGoalA.getGoalId() - userGoalB.getGoalId());
    }
}

export default UserGoalUtils;