import { IProductDetail } from "type/component";
import ProductImage from "./ProductImage";
import ProductDetails from "./ProductDetails";


function ProductSection(props: IProductDetail) {
  const { _id, name, price, description, quantity, imagePaths } = props;
  return (
    <div className="flex flex-col items-center justify-center w-11/12 max-w-6xl mx-auto space-y-8 md:flex-row md:items-start md:space-y-0 md:space-x-4 lg:space-x-8">
      <ProductImage imagePaths={imagePaths} />
      <ProductDetails quantity={quantity} _id={_id} title={name} description={description} price={price} />
    </div>
  );
}

export default ProductSection;
