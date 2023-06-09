const containerService = require('../services/container');
const bookingService = require('../services/booking');


const getContainersStatistics = async () => {
  const containers = await containerService.getAllContainers();
  const containersUsage = await getContainersUsage(containers);
  const containersBasicStats = await containerService.getContainersBasicStatistics();
  return {
    ...containersUsage,
    ...containersBasicStats,
  };
}

const getContainersUsage = async (containers) => {
  console.log(containers);
  const currentDate = new Date();
  const startOfTheMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfTheMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  for (const container of containers) {
    container.bookings = await bookingService.getAllBookingsForContainer(container.id);
    container.currentMonthBookings = container.bookings.filter(booking => booking.startTime >= startOfTheMonth || booking.endTime <= endOfTheMonth);
    const bookingTimeTotalInMs = getContainerUsageTime(container.bookings);
    const bookingTimeTotalInMinutes = bookingTimeTotalInMs / 60000;

    const bookingTimeTotalInMsPerCurrentMonth = getContainerUsageTime(container.currentMonthBookings);
    const bookingTimeTotalInMinutesPerCurrentMonth = bookingTimeTotalInMsPerCurrentMonth / 60000;

    const violationsTotalCount = getContainerViolationsCount(container.bookings);
    const violationsTotalCountPerCurrentMonth = getContainerViolationsCount(container.currentMonthBookings);

    container.bookings.stats = {
      total: {
        usageTime: bookingTimeTotalInMinutes,
        violationsCount: violationsTotalCount
      },
      monthly: {
        usageTime: bookingTimeTotalInMinutesPerCurrentMonth,
        violationsCount: violationsTotalCountPerCurrentMonth
      }
    };
  }
  return containers.map(container => container.bookings.stats);
}

const getContainerUsageTime = (bookings) => {
  return bookings.map(booking => booking.endTime - booking.startTime).reduce((acc, currentTime) => acc + currentTime, 0);
}

const getContainerViolationsCount = (bookings) => {
  return bookings.filter(booking => booking.violationRecorded).length;
}

module.exports = {
  getContainersStatistics
}
