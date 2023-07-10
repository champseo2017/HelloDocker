interface IImageObject {
  file: File;
}

interface IProduct {
  name: string;
  price: number;
  description: string;
  quantity: number;
  productImages: IImageObject[];
}

export type { IImageObject, IProduct };
