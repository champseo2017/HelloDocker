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

export type { IProductListings, IDetailProduct, IProductDetail };
