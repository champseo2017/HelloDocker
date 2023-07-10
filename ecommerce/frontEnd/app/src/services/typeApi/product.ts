interface IImageObject {
  position: number;
  url: string;
}

interface IProduct {
  name: string;
  price: number;
  description: string;
  quantity: number;
  imagePaths: IImageObject[];
}

export type { IImageObject, IProduct };
