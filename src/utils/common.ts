export const deleteKey = (obj: any, key: string) => {
  const newObj = { ...obj };
  delete newObj[key];
  return newObj;
}

export const deleteKeys = (obj: any, keys: string[]) => {
  const newObj = { ...obj };
  keys.forEach((key: string) => {
    delete newObj[key];
  })
  return newObj;
}

export const convertTimeToMeridiem = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const AmOrPm = h >= 12 ? 'pm' : 'am';
  const hours = (h % 12) || 12;
  return `${hours}:${m} ${AmOrPm}`;
}