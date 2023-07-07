export const removeUnwantedFields = (object, fields) => {
  const result = { ...object };
  fields.forEach((field) => {
    delete result[field];
  });
  return result;
};
