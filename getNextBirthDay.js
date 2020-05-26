module.exports = function getNextBirthDay(date) {
    const dob = new Date(date);
    const month = dob.getMonth();
    const day = dob.getDate();
    const d = new Date();
    const y = d.getFullYear();
    return Math.floor((Date.UTC(y + 1, month, day) - Date.UTC(y, d.getMonth(), d.getDate()) ) /(1000 * 60 * 60 * 24));
}
