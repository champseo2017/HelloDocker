interface IImageObject {
  file: File;
}

interface IProductAdd {
  name: string;
  price: number;
  description: string;
  quantity: number;
  productImages: IImageObject[];
}

interface IProductGet {
  page: number;
  sort: string;
  limit: number;
}

export type { IImageObject, IProductAdd, IProductGet };
