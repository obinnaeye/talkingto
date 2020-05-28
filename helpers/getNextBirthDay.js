module.exports = function getNextBirthDay(date) {
    const dob = new Date(date);
    const month = dob.getMonth();
    const day = dob.getDate();
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth()
    const d = today.getDate()
    console.log({today})
    console.log({dob})
    let y2 = month < m ? y + 1 : y
    y2 = month > m ? y : y2
    if (month == m) {
        y2 = day <= d ? y + 1 : y
    }
    return Math.floor((Date.UTC(y2, month, day) - Date.UTC(y, m, d) ) /(1000 * 60 * 60 * 24));
}
