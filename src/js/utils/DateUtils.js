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
        return new Date(formattedString);
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
}

export default DateUtils;