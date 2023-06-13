const ExcelJS = require("exceljs");
const XLSX = require("xlsx");
const XLSXChart = require("xlsx-chart");
const statisticsService = require("../business-logic/statistics");
const REPORTS_DIR = process.env.EXCEL_DIRECTORY;

const createStatisticsXlsx = async (containerStatistics) => {
  const workbook = XLSX.utils.book_new();

  console.log(containerStatistics.statsByContainer);

  // Create sheet for container statistics
  const containerStatsSheet = XLSX.utils.json_to_sheet(containerStatistics.statsByContainer.map(containerStats => ({
    id: containerStats.containerId.toString(),
    Title: containerStats.title,
    Type: containerStats.type,
    'Total Usage (hrs)': (containerStats.stats.total.usageTime/60).toFixed(3),
    'Monthly Usage (hrs)': (containerStats.stats.monthly.usageTime/60).toFixed(3),
    'Total Violations': containerStats.stats.total.violationsCount,
    'Monthly Violations': containerStats.stats.monthly.violationsCount,
  })));
  XLSX.utils.book_append_sheet(workbook, containerStatsSheet, 'Container Statistics');

  // Create sheet for basic statistics
  const basicStatsSheet = XLSX.utils.json_to_sheet([
    { Stat: 'Containers Count by Status' },
    ...containerStatistics.basicStats.containersCountByStatus,
    { Stat: 'Containers Count by Location' },
    ...containerStatistics.basicStats.containersCountByLocation,
    { Stat: 'Containers Count by Type' },
    ...containerStatistics.basicStats.containersCountByType
  ]);
  XLSX.utils.book_append_sheet(workbook, basicStatsSheet, 'Basic Statistics');

  // Create sheet for totals
  const totalsSheet = XLSX.utils.json_to_sheet([
    { Stat: 'Totals' },
    { Stat: 'Total Usage Time (mins)' }, { Value: containerStatistics.totals.totalUsageTime },
    { Stat: 'Monthly Usage Time (mins)' }, { Value: containerStatistics.totals.monthlyUsageTime },
    { Stat: 'Average Total Usage Time (mins)' }, { Value: containerStatistics.totals.avgTotalUsageTime },
    { Stat: 'Average Monthly Usage Time (mins)' }, { Value: containerStatistics.totals.avgMonthlyUsageTime },
    { Stat: 'Total Violations Count' }, { Value: containerStatistics.totals.totalViolationsCount },
    { Stat: 'Monthly Violations Count' }, { Value: containerStatistics.totals.monthlyViolationsCount },
    { Stat: 'Avg Violations Count' }, { Value: containerStatistics.totals.avgViolationsCount },
    { Stat: 'Avg Monthly Violations Count' }, { Value: containerStatistics.totals.avgMonthlyViolationsCount },
  ]);
  XLSX.utils.book_append_sheet(workbook, totalsSheet, 'Totals');

  const name = `${REPORTS_DIR}/statistics-${new Date().toISOString()}.xlsx`;
  console.log(name);
  // Write workbook to file
  await XLSX.writeFile(workbook, name);
  return name;
};


const createCharts = async (containerStatistics) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Chart");

  // Створення нового об'єкта графіка
  const chart = new XLSXChart();

  const opts = {
    file: "chart.xlsx",
    chart: "column",
    titles: [
      "Title 1",
      "Title 2",
      "Title 3"
    ],
    fields: [
      "Field 1",
      "Field 2",
      "Field 3",
      "Field 4"
    ],
    data: {
      "Title 1": {
        "Field 1": 5,
        "Field 2": 10,
        "Field 3": 15,
        "Field 4": 20
      },
      "Title 2": {
        "Field 1": 10,
        "Field 2": 5,
        "Field 3": 20,
        "Field 4": 15
      },
      "Title 3": {
        "Field 1": 20,
        "Field 2": 15,
        "Field 3": 10,
        "Field 4": 5
      }
    }
  };
  chart.writeFile(opts, function(err) {
    console.log("File: ", opts.file);
  });
};

module.exports = {
  createStatisticsXlsx
};
