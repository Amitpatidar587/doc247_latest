const convertToMinutes = (time, isEndTime = false) => {
  if (!time || typeof time !== "string") return 0;

  const is12Hour = /AM|PM/i.test(time);
  let hour = 0,
    minute = 0;

  if (is12Hour) {
    const parts = time.trim().replace(/\s+/g, " ").split(/[: ]/);
    if (parts.length < 3) return 0;

    const [rawHour, rawMinute, meridian] = parts;
    hour = parseInt(rawHour, 10);
    minute = parseInt(rawMinute, 10);
    if (isNaN(hour) || isNaN(minute)) return 0;

    if (meridian.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (meridian.toUpperCase() === "AM" && hour === 12) hour = 0;
  } else {
    // Assume 24-hour format: "03:17" or "23:45"
    const parts = time.trim().replace(/\s+/g, " ").split(/[: ]/);
    if (parts.length !== 2) return 0;

    hour = parseInt(parts[0], 10);
    minute = parseInt(parts[1], 10);
    if (isNaN(hour) || isNaN(minute)) return 0;
  }

  let total = hour * 60 + minute;
  if (isEndTime && total === 0) total = 1440;

  return total;
};

 const validateSlotTimes = ({
  slotStartTime,
  slotEndTime,
  slotDuration,
  slotInterval,
}) => {
  console.log(slotStartTime, slotEndTime, slotDuration, slotInterval);
  if (!slotStartTime || !slotEndTime) {
    return "Start time and end time are required.";
  }

  console.log(slotStartTime, slotEndTime);
  const startMins = convertToMinutes(slotStartTime);
  const endMins = convertToMinutes(slotEndTime, true);

  if (endMins <= startMins) {
    return "End time must be after start time.";
  }

  const totalAvailable = endMins - startMins;
  const totalRequired = Number(slotDuration) + Number(slotInterval);

  if (totalRequired > totalAvailable) {
    return "Duration + Interval exceeds available time range.";
  }

  return null;
};
export default validateSlotTimes;