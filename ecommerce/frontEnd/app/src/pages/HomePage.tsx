import { useState, useEffect } from "react";
import StoreHeading from "components/client/StoreHeading";
import ProductListings from "components/client/ProductListings";
import { productController } from "services/apiController/product";
import { IProductListings } from "type/component";

const HomePage = () => {
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
    <div className="mx-auto max-w-6xl">
      <StoreHeading />
      <ProductListings
        totalProducts={products.totalProducts}
        totalPages={products.totalPages}
        currentPage={products.currentPage}
        products={products.products}
      />
    </div>
  );
};

export default HomePage;
