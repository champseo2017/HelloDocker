import { useState, useEffect } from "react";
import { productController } from "services/apiController/product";
import { IProductListings } from "type/component";
import ProductSection from "components/client/ProductSection";
import { useParams } from "react-router-dom";
import { IProductDetail } from "type/component";

type ParamTypes = {
  id: string;
};

const ProductPage = () => {
  const { id } = useParams<ParamTypes>();

  const [products, setProducts] = useState<IProductDetail>({
    _id: "",
    name: "",
    price: 0,
    description: "",
    quantity: 0,
    imagePaths: [],
  });

  const fetchData = async () => {
    const response = await productController().getById(id);
    const { data } = response;

    if (data) {
      setProducts(data);
    }
  };

  useEffect(() => {
    fetchData();
    const element = document.documentElement || document.body;
    element.scrollIntoView({ behavior: "smooth" });
    console.log("element", element);
    return () => {};
  }, []);

  return (
    <div className="min-h-screen py-12 sm:pt-20">
      <ProductSection
        _id={products._id}
        name={products.name}
        price={products.price}
        description={products.description}
        quantity={products.quantity}
        imagePaths={products.imagePaths}
      />
    </div>
  );
};

export default ProductPage;
