export const deleteKey = (obj: any, key: string) => {
  let newObj = { ...obj };
  delete newObj[key];
  return newObj;
}

export const deleteKeys = (obj: any, keys: string[]) => {
  let newObj = { ...obj };
  keys.forEach((key: string) => {
    delete newObj[key];
  })
  return newObj;
}

export const convertTimeToMeridiem = (time: string) => {
  let text = "";
  let [hours, minutes] = time.split(":").map(Number);
  let AmOrPm = hours >= 12 ? 'pm' : 'am';
  hours = (hours % 12) || 12;
  return `${hours}:${minutes} ${AmOrPm}`;
}