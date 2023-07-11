import { IProductListings } from "type/component";
import ProductCard from "./ProductCard";

function ProductListings(props: IProductListings) {
  const { currentPage, products, totalPages, totalProducts } = props;
  return (
    <div className="py-12 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
      {products.map((product, index) => (
        <ProductCard
          key={index}
          quantity={product.quantity}
          _id={product._id}
          name={product.name}
          description={product.description}
          price={product.price}
          imagePaths={product.imagePaths}
        />
      ))}
    </div>
  );
}

export default ProductListings;
