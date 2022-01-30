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

    static getReport(goalIdList, userGoalListByDate) {
        let result = this.getDefaultReport(goalIdList);

        // 카운드 집계
        for (let date in userGoalListByDate) {
            let userGoalList = userGoalListByDate[date];
            userGoalList.map(userGoal => {
                let goalId = userGoal.getGoalId();
                result.select.countByGoalId[goalId]++;
                if (userGoal.getSuccess())
                    result.success.countByGoalId[goalId]++;
            });
        }

        // 합계, 최소, 최대 카운트 집계
        let successList = Object.values(result.success.countByGoalId);
        result.success.minCount = Math.min(...successList);
        result.success.maxCount = Math.max(...successList);
        successList.map(count => result.success.totalCount += count);

        let selectList = Object.values(result.select.countByGoalId);
        result.select.minCount = Math.min(...selectList);
        result.select.maxCount = Math.max(...selectList);
        selectList.map(count => result.select.totalCount += count);

        return result;
    }

    static getDefaultReport(goalIdList) {
        let result = {
            success: {
                maxCount: 0,
                minCount: 0,
                totalCount: 0,
                countByGoalId: {}
            },
            select: {
                maxCount: 0,
                minCount: 0,
                totalCount: 0,
                countByGoalId: {}
            }
        };

        // 0으로 초기화
        goalIdList.map(goalId => {
            result.success.countByGoalId[goalId] = 0;
            result.select.countByGoalId[goalId] = 0;
        });

        return result;
    }
}

export default UserGoalUtils;