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

export type { IProductListings, IDetailProduct };
