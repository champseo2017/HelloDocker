import { useState, useEffect } from "react";
import { productController } from "services/apiController/product";
import { IProductListings } from "type/component";

const ProductPage = () => {
  const [products, setProducts] = useState<IProductListings>({
    currentPage: 0,
    products: [],
    totalPages: 0,
    totalProducts: 0,
  });

  const fetchData = async () => {
    const response = await productController().get({
      page: 1,
      sort: "-createdAt",
      limit: 10,
    });
    const { data } = response;
    setProducts(data);
  };

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  return (
    <div className="min-h-screen py-12 sm:pt-20">
      
    </div>
  );
};

export default ProductPage;
