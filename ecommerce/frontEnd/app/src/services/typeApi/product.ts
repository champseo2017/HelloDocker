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


interface IImageObjectUpdate {
  position: Number
}

interface IUploadedImages {
  file: File;
  position: number
}

interface IProductUpdate {
  name: string;
  price: number;
  description: string;
  quantity: number;
  productImages: IImageObject[];
  positionImage: IImageObjectUpdate[]
}

interface IProductGet {
  page: number;
  sort: string;
  limit: number;
}

export type { IImageObject, IProductAdd, IProductGet, IProductUpdate, IUploadedImages };
