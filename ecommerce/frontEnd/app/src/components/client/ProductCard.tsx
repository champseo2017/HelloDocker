import { Link } from "react-router-dom";
import Price from "./Price";
import Image from "./Image";
import { IDetailProduct } from "type/component";

function ProductCard(props: IDetailProduct) {
  const { _id, name, description, price, imagePaths } = props;
  const imageNode = imagePaths[0].url;

  return (
    <Link
      to={`/products/${_id}`}
      className="h-120 w-72 rounded shadow-lg mx-auto border border-palette-lighter"
    >
      <Image
        src={imageNode}
        alt={name}
        className="h-72 border-b-2 border-palette-lighter relative"
      />
      <div className="h-48 relative">
        <div className="font-primary text-palette-primary text-2xl pt-4 px-4 font-semibold">
          {name}
        </div>
        <div className="text-lg text-gray-600 p-4 font-primary font-light">
          {description}
        </div>
        <div
          className="text-palette-dark font-primary font-medium text-base absolute bottom-0 right-0 mb-4 pl-8 pr-4 pb-1 pt-2 bg-palette-lighter 
              rounded-tl-sm triangle"
        >
          <Price currency="$" num={price} numSize="text-lg" />
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
