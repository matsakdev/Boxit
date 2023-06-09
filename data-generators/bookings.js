const Indicators = require('../constants/indicators')
const moment = require("moment");

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getNextDate = (year, month, currentEndDate) => {
  const shift = getRandomNumber(1, 4);
  return currentEndDate.clone().add(shift, 'days');
}

const BookingsGenerator = async (containers, users, year, month) => {
  const bookings = [];

  const endOfMonth = moment(`${year}-${month}`, 'YYYY-M').endOf('month');

  containers.forEach((container) => {

    let currentEndDate = moment(`${year}-${month}`, 'YYYY-M').startOf('month');

    while (true) {
      const startTime = getNextDate(year, month, currentEndDate);
      if (startTime > endOfMonth) break;

      currentEndDate = startTime.clone().add(getRandomNumber(8, 125), 'hours');
      if (currentEndDate > endOfMonth) currentEndDate = endOfMonth;

      const user = users[Math.floor(Math.random() * users.length)];

      const requirements = {};

      Object.values(Indicators).forEach((indicator) => {
        switch (indicator) {
          case Indicators.VIBRATION:
            requirements[indicator] = getRandomNumber(30, 80);
            break;
          case Indicators.LIGHT_DETECTOR:
            requirements[indicator] = getRandomNumber(0, 12000);
            break;
          case Indicators.HUMIDITY:
            requirements[indicator] = getRandomNumber(10, 95);
            break;
          case Indicators.TEMPERATURE:
            requirements[indicator] = getRandomNumber(-25, 45);
            break;
          default:
            break;
        }
      });

      const booking = {
        startTime: startTime.toDate(),
        endTime: currentEndDate.toDate(),
        container: container.id,
        user: user.id,
        requirements,
      };

      bookings.push(booking);
    }
  });

  return bookings;
}

module.exports = {
  BookingsGenerator
};
