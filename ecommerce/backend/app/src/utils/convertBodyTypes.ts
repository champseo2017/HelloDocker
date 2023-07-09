const convertType = (value: string, type: string) => {
  switch (type) {
    case "number":
      return Number(value);
    case "boolean":
      return value === "true";
    case "bigint":
      return BigInt(value);
    case "undefined":
      return undefined;
    case "object":
    case "array":
      try {
        const parsedArray = JSON.parse(value);

        return parsedArray;
      } catch (error) {
        return value;
      }
    // Add more cases as needed
    default:
      return value;
  }
};

export const convertBodyTypes = (typeMap) => {
  return (req, res, next) => {
    req.body = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => {
        const type = typeMap[key];
        if (type) {
          return [key, convertType(String(value), type)];
        }
        return [key, String(value)];
      })
    );
    next();
  };
};
