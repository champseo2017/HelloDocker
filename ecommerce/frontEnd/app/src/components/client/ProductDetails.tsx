import BackToProductButton from "./BackToProductButton";
import ProductInfo from "./ProductInfo";
import ProductForm from "components/form/ProductForm";

interface IProductInfo {
  title: string;
  description: string;
  price: number;
  _id: string;
  quantity: number;
}

const ProductDetails = (props: IProductInfo) => {
  const { title, description, price, quantity, _id } = props;
  return (
    <div className="flex flex-col justify-between w-full h-full max-w-xs mx-auto space-y-4 md:w-1/2 min-h-128">
      <BackToProductButton />
      <ProductInfo title={title} description={description} price={price} />
      <ProductForm
        _id={_id}
        name={title}
        price={price}
        description={description}
        quantity={quantity}
      />
    </div>
  );
};

export default ProductDetails;
