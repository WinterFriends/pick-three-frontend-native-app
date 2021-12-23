class DateUtils {
    /**
     * Date 객체를 'yyyy-mm-dd' 형식의 문자열로 변환
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
     * 'yyyy-mm-dd' 형식의 문자열을 Date 객체로 변환
     * @param {string} formattedString 
     * @returns date
     */
    static formattedStringToDate(formattedString) {
        return new Date(formattedString);
    }
}

export default DateUtils;