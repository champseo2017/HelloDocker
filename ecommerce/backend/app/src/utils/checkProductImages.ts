export const checkProductImages = (productImages: any) => {
  if (productImages !== undefined && productImages === 0) {
    throw new Error("No productImages were provided");
  }
  return;
};
