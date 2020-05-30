const getNextBirthDay = require("../../helpers/getNextBirthDay");

describe("getNextBirthDay function", () => {
  beforeAll(() => {
    // Lock Time to 2020-05-29T15:07:03.667Z
    jest.spyOn(Date, "now").mockImplementation(() => 1590764823667);
  });

  afterAll(() => {
    // Unlock Time
    jest.spyOn(Date, "now").mockRestore();
  });

  const currentDate = new Date(Date.now());
  const currentYear = currentDate.getUTCFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  // Days left in 2020 from 2020-05-29T15:07:03.667Z
  const daysLeftInYear =
    (Date.UTC(currentYear, 11, 31) -
      Date.UTC(currentYear, currentMonth, currentDay)) /
    (1000 * 60 * 60 * 24);

  test("case when birth month is past, should return a day in the next year", () => {
    const dob = "1990-02-18";
    expect(getNextBirthDay(dob) > daysLeftInYear).toBeTruthy();
  });

  test("case when birth month is in future, should return a day in the current year", () => {
    const dob = "1990-10-18";
    expect(getNextBirthDay(dob) < daysLeftInYear).toBeTruthy();
  });

  test("case when birthday is current month but future day, should return a day in the current year", () => {
    const dob = "1990-05-31";
    expect(getNextBirthDay(dob) < daysLeftInYear).toBeTruthy();
  });

  test("case when birthday is current month but past day, should return a day in the next year", () => {
    const dob = "1990-05-18";
    expect(getNextBirthDay(dob) > daysLeftInYear).toBeTruthy();
  });

  test("case when birthday is today, should return a 365", () => {
    const dob = "1990-05-29";
    expect(getNextBirthDay(dob) == 365).toBeTruthy();
  });
});
