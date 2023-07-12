interface IDetailProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  imagePaths: {
    position: number;
    url: string;
  }[];
  quantity: number;
}

interface IProductListings {
  currentPage: number;
  products: IDetailProduct[];
  totalPages: number;
  totalProducts: number;
}

interface IProductDetail {
  _id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  imagePaths: {
    position: number;
    url: string;
  }[];
}

interface IProduct {
  productId: string;
  quantity: number;
}

interface IImagePath {
  position: number;
  url: string;
}

interface IProductData {
  _id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  imagePaths: IImagePath[];
  createdAt: string;
  updatedAt: string;
}

interface ICartProduct {
  product: IProductData;
  quantity: number;
}

interface IDataFetchCart {
  _id: string;
  products: ICartProduct[];
  createdAt: string;
  updatedAt: string;
}

export type {
  IProductListings,
  IDetailProduct,
  IProductDetail,
  IDataFetchCart,
  IProduct,
  IImagePath,
  IProductData,
  ICartProduct,
};
