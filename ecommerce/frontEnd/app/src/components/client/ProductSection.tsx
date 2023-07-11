import { IProductDetail } from "type/component";
import ProductImage from "./ProductImage";
import ProductDetails from "./ProductDetails";

function ProductSection(props: IProductDetail) {
  const { _id, name, price, description, quantity, imagePaths } = props;
  return (
    <div className="flex flex-col justify-center items-center md:flex-row md:items-start space-y-8 md:space-y-0 md:space-x-4 lg:space-x-8 max-w-6xl w-11/12 mx-auto">
      <ProductImage imagePaths={imagePaths} />
      <ProductDetails title={name} description={description} price={price} />
    </div>
  );
}

export default ProductSection;
