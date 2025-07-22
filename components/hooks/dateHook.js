import { useCallback } from "react";
import { format, parseISO, isToday, isTomorrow, isYesterday } from "date-fns";

export const use12HourFormat = () => {
  const formatTime = useCallback((timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(+hours);
    date.setMinutes(+minutes);
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  return formatTime;
};

export const useFriendlyDate = () => {
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "";

    const inputDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    if (isSameDay(inputDate, today)) return "Today";
    if (isSameDay(inputDate, tomorrow)) return "Tomorrow";

    return inputDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, []);

  return formatDate;
};

export const getAge = (birthDateString) => {
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const formatReadableDate = (isoDateString) => {
  if (!isoDateString) return "";

  const date = parseISO(isoDateString);

  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isYesterday(date)) return "Yesterday";

  // Example: 2 Jun 2025
  return format(date, "d MMM yyyy");
};
