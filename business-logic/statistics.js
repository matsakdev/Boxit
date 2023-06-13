const containerService = require("../services/container");
const bookingService = require("../services/booking");


const getContainersStatistics = async () => {
  const containers = await containerService.getAllContainers();
  const containersUsage = await getContainersUsage(containers);
  const containersBasicStats = await containerService.getContainersBasicStatistics(containers);
  const containersTotalUsageAndViolations = await getContainersTotalUsageAndViolations(containers);
  return {
    statsByContainer: containersUsage,
    basicStats: containersBasicStats,
    totals: containersTotalUsageAndViolations
  };
};

const getContainersUsage = async (containers) => {
  const currentDate = new Date();
  const startOfTheMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfTheMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  for (const container of containers) {
    container.bookings = await bookingService.getAllBookingsForContainer(container.id);
    container.currentMonthBookings = container.bookings.filter(
      booking => (booking.startTime >= startOfTheMonth && booking.startTime <= endOfTheMonth)
        || (booking.endTime >= startOfTheMonth && booking.endTime <= endOfTheMonth));
    console.log("[current month bookings]", container.currentMonthBookings);
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
  return containers.map(container => ({
    containerId: container.id,
    title: container.title,
    type: container.type,
    stats: container.bookings.stats
  }));
};

const getContainersTotalUsageAndViolations = async (containers) => {
  const totalUsageTime = containers.map(container => container.bookings.stats.total.usageTime).reduce((acc, currentValue) => acc + currentValue, 0);
  const monthlyUsageTime = containers.map(container => container.bookings.stats.monthly.usageTime).reduce((acc, currentValue) => acc + currentValue, 0);

  const avgTotalUsageTime = totalUsageTime / containers.length;
  const avgMonthlyUsageTime = monthlyUsageTime / containers.length;

  const totalViolationsCount = containers.map(container => container.bookings.stats.total.violationsCount).reduce((acc, currentValue) => acc + currentValue, 0);
  const monthlyViolationsCount = containers.map(container => container.bookings.stats.monthly.violationsCount).reduce((acc, currentValue) => acc + currentValue, 0);


  const avgViolationsCount = totalViolationsCount / containers.length;
  const avgMonthlyViolationsCount = monthlyViolationsCount / containers.length;

  return {
    totalUsageTime,
    monthlyUsageTime,
    avgTotalUsageTime,
    avgMonthlyUsageTime,
    totalViolationsCount,
    monthlyViolationsCount,
    avgViolationsCount,
    avgMonthlyViolationsCount
  };

};

const getContainerUsageTime = (bookings) => {
  return bookings.map(booking => booking.endTime - booking.startTime).reduce((acc, currentTime) => acc + currentTime, 0);
};

const getContainerViolationsCount = (bookings) => {
  return bookings.filter(booking => booking.violationRecorded).length;
};

module.exports = {
  getContainersStatistics
};
