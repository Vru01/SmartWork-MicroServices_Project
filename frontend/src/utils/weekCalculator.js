// Function to calculate ISO week number from a date
export const getWeekNumber = (date) => {
  const target = new Date(date.valueOf());
  const dayNumber = (date.getUTCDay() + 6) % 7; // Monday = 0
  target.setUTCDate(target.getUTCDate() - dayNumber + 3);
  const firstThursday = new Date(target.getUTCFullYear(), 0, 4);
  const diff = target - firstThursday;
  return "W" + (1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000)));
};
