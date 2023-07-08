export const convertToNumber = (body: any): any => {
  const newBody = { ...body }; // create a new object to avoid modifying the original one
  Object.keys(newBody).forEach((key) => {
    const value = newBody[key];
    if (typeof value === "string" && !isNaN(Number(value))) {
      newBody[key] = Number(value);
    }
  });
  return newBody;
};
