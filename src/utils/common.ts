import { format, subDays } from "date-fns";

export const deleteKey = (obj: any, key: string) => {
  const newObj = { ...obj };
  delete newObj[key];
  return newObj;
};

export const deleteKeys = (obj: any, keys: string[]) => {
  const newObj = { ...obj };
  keys.forEach((key: string) => {
    delete newObj[key];
  });
  return newObj;
};

export const convertTimeToMeridiem = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const AmOrPm = h >= 12 ? "pm" : "am";
  const hours = h % 12 || 12;
  return `${hours}:${m} ${AmOrPm}`;
};

export const stringAvatar = (text: string): string => {
  let avatar = "";
  if (!text) return avatar;
  const parts = text.split(" ");
  if (parts.length > 1) {
    avatar = parts[0][0] + parts[1][0];
  } else {
    avatar = parts[0][0];
  }
  return avatar;
};

export const ConvertToCurrency = (number: number) => {
  const RupeeIndian = Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return RupeeIndian.format(number);
};

export const formatDateText = (date: string, time: string) => {
  if (new Date(date).toLocaleDateString() === new Date().toLocaleDateString()) {
    return `Today, ${convertTimeToMeridiem(time)}`;
  }
  if (new Date(date).toLocaleDateString() === subDays(new Date(), 1).toLocaleDateString()) {
    return `Yesterday, ${convertTimeToMeridiem(time)}`;
  }
  return `${format(new Date(date), "dd MMM")}, ${convertTimeToMeridiem(time)}`;
};
