class DateUtils {
    /**
     * Date 객체를 'yyyy-mm-dd' 형식의 문자열로 변환하는 함수
     * @param {Date} date 
     * @returns formattedString
     */
    static dateToFormattedString(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    /**
     * 'yyyy-mm-dd' 형식의 문자열을 Date 객체로 변환하는 함수
     * @param {string} formattedString 
     * @returns date
     */
    static formattedStringToDate(formattedString) {
        var sYear = formattedString.substring(0, 4);
        var sMonth = formattedString.substring(5, 7);
        var sDate = formattedString.substring(8, 10);

        return new Date(Number(sYear), Number(sMonth) - 1, Number(sDate));
    }

    static _dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    static _fullDayOfWeek = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    /**
     * Date의 요일을 한글로 알려주는 함수
     * @param {Date} date 
     */
    static getDayOfWeek(date, full = false) {
        let index = date.getDay();
        if (full)
            return this._fullDayOfWeek[index];
        else
            return this._dayOfWeek[index];
    }


    /**
     * 해당 년, 월이 몇 주인지 알려주는 함수 
     * @param {number} year 
     * @param {number} month 
     * @returns 해당 월의 주 개수
     */
    static getWeekCountOfMonth(year, month) {
        const dayCountOfWeek = 7;

        let firstDate = new Date(year, month - 1, 1);
        let lastDate = new Date(year, month, 0);
        let used = firstDate.getDay() + lastDate.getDate();
        let count = Math.ceil(used / dayCountOfWeek);

        return count;
    }

    /**
     * 해당 년, 월의 마지막 날을 알려주는 함수
     * @param {number} year 
     * @param {number} month 
     * @returns 해당 월의 마지막 날
     */
    static getLastDayOfMonth(year, month) {
        let lastDate = new Date(year, month, 0);
        return lastDate.getDate();
    }


    /**
     * 해당하는 년, 월, 주를 알려주는 함수
     * @param {Date} date 포맷팅된 날짜 문자열
     * @returns 해당 일이 포함되는 년, 월, 주
     */
    static getWeekNumberByMonth(date) {
        const inputDate = date;

        // 인풋의 년, 월
        let year = inputDate.getFullYear();
        let month = inputDate.getMonth() + 1;

        // 목요일 기준 주차 구하기
        const weekNumberByThurFnc = (paramDate) => {

            const year = paramDate.getFullYear();
            const month = paramDate.getMonth();
            const date = paramDate.getDate();

            // 인풋한 달의 첫 날과 마지막 날의 요일
            const firstDate = new Date(year, month, 1);
            const lastDate = new Date(year, month + 1, 0);
            const firstDayOfWeek = firstDate.getDay() === 0 ? 7 : firstDate.getDay();
            const lastDayOfweek = lastDate.getDay();

            // 인풋한 달의 마지막 일
            const lastDay = lastDate.getDate();

            // 첫 날의 요일이 금, 토, 일요일 이라면 true
            const firstWeekCheck = firstDayOfWeek === 5 || firstDayOfWeek === 6 || firstDayOfWeek === 7;
            // 마지막 날의 요일이 월, 화, 수라면 true
            const lastWeekCheck = lastDayOfweek === 1 || lastDayOfweek === 2 || lastDayOfweek === 3;

            // 해당 달이 총 몇주까지 있는지
            const lastWeekNo = Math.ceil((firstDayOfWeek - 1 + lastDay) / 7);

            // 날짜 기준으로 몇주차 인지
            let weekNo = Math.ceil((firstDayOfWeek - 1 + date) / 7);

            // 인풋한 날짜가 첫 주에 있고 첫 날이 월, 화, 수로 시작한다면 'prev'(전달 마지막 주)
            if (weekNo === 1 && firstWeekCheck) weekNo = 'prev';
            // 인풋한 날짜가 마지막 주에 있고 마지막 날이 월, 화, 수로 끝난다면 'next'(다음달 첫 주)
            else if (weekNo === lastWeekNo && lastWeekCheck) weekNo = 'next';
            // 인풋한 날짜의 첫 주는 아니지만 첫날이 월, 화 수로 시작하면 -1;
            else if (firstWeekCheck) weekNo = weekNo - 1;

            return weekNo;
        };

        // 목요일 기준의 주차
        let weekNo = weekNumberByThurFnc(inputDate);

        // 이전달의 마지막 주차일 떄
        if (weekNo === 'prev') {
            // 이전 달의 마지막날
            const afterDate = new Date(year, month - 1, 0);
            year = month === 1 ? year - 1 : year;
            month = month === 1 ? 12 : month - 1;
            weekNo = weekNumberByThurFnc(afterDate);
        }
        // 다음달의 첫 주차일 때
        if (weekNo === 'next') {
            year = month === 12 ? year + 1 : year;
            month = month === 12 ? 1 : month + 1;
            weekNo = 1;
        }

        return { year, month, weekNo };
    }

    /**
     * 해당하는 주의 시작일을 알려주는 함수
     * @param {Date} date
     * @returns 해당주의 시작일 Date
     */
    static getFirstDayOfWeek(date) {
        const offset = 86400000; // 하루의 밀리초

        let prevDate = date;
        let prevWeekNo = this.getWeekNumberByMonth(prevDate).weekNo;

        while (true) {
            let newDate = new Date(prevDate.getTime() - offset);
            let newWeekNo = this.getWeekNumberByMonth(newDate).weekNo;

            if (newWeekNo == prevWeekNo) {
                prevDate = newDate;
                prevWeekNo = newWeekNo;
            }
            else
                break;
        }

        return prevDate;
    }
}

export default DateUtils;