import BackToProductButton from "./BackToProductButton";
import ProductInfo from "./ProductInfo";

interface IProductInfo {
  title: string;
  description: string;
  price: number;
}

const ProductDetails = (props: IProductInfo) => {
  const { title, description, price } = props;
  return (
    <div className="flex flex-col justify-between h-full w-full md:w-1/2 max-w-xs mx-auto space-y-4 min-h-128">
      <BackToProductButton />
      <ProductInfo title={title} description={description} price={price} />
    </div>
  );
};

export default ProductDetails;
