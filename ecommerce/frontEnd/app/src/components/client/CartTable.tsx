import { ChangeEvent, MouseEvent } from "react";
import { useCart } from "contexts/CartContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Price from "components/client/Price";
import { calculateSubtotal } from "utils/calculateSubtotal";
import { useCallback, useMemo } from "react";

const CartTable = () => {
  const {
    cart,
    addToCart,
    getCart,
    quantity: useQuantity,
    setQuantity: useSetQuantity,
    updateToCart,
  } = useCart();

  const resultSubtotal = useMemo(() => {
    const res = calculateSubtotal(cart);
    return res;
  }, [cart]);

  const handlersUpdateCart = useCallback(
    (e: ChangeEvent<HTMLInputElement>, productId: string) => {
      e.preventDefault();
      const qRes = parseInt(e.target.value);
      const pId = productId;
      const data = {
        productId: pId,
        quantity: qRes,
      };
      updateToCart(data)
    },
    []
  );

  return (
    <div className="w-full max-w-2xl mx-auto my-4 min-h-80 sm:my-8">
      <table className="mx-auto">
        <thead>
          <tr className="text-xs uppercase border-b sm:text-sm text-palette-primary border-palette-light">
            <th className="px-6 py-4 font-normal font-primary">Product</th>
            <th className="px-6 py-4 font-normal font-primary">Quantity</th>
            <th className="px-6 py-4 font-normal font-primary">
              Number of items
            </th>
            <th className="hidden px-6 py-4 font-normal font-primary sm:table-cell">
              Price
            </th>
            <th className="px-6 py-4 font-normal font-primary">Remove</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-palette-lighter">
          {cart &&
            cart?.products.length &&
            cart?.products.map((item, index) => (
              <tr
                key={index}
                className="text-sm text-center text-gray-600 sm:text-base"
              >
                <td className="flex items-center px-4 py-4 font-medium font-primary sm:px-6">
                  <img
                    src={item.product.imagePaths[0].url}
                    alt={item.product.name}
                    height={64}
                    width={64}
                    className={`hidden sm:inline-flex`}
                  />
                  <Link
                    className="pt-1 hover:text-palette-dark"
                    to={`/products/${item.product._id}`}
                  >
                    {item.product.name}
                  </Link>
                </td>
                <td className="px-4 py-4 font-medium font-primary sm:px-6">
                  <input
                    type="number"
                    inputMode="numeric"
                    id="variant-quantity"
                    name="variant-quantity"
                    min="1"
                    step="1"
                    value={item.quantity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handlersUpdateCart(e, item.product._id)
                    }
                    className="w-16 text-gray-900 border border-gray-300 rounded-sm form-input focus:border-palette-light focus:ring-palette-light"
                  />
                </td>
                <td className="px-4 py-4 font-medium font-primary sm:px-6">
                  {item.product.quantity}
                </td>
                <td className="hidden px-4 py-4 text-base font-light font-primary sm:px-6 sm:table-cell">
                  <Price
                    currency="$"
                    num={item.product.price}
                    numSize="text-lg"
                  />
                </td>
                <td className="px-4 py-4 font-medium font-primary sm:px-6">
                  <button
                    aria-label="delete-item"
                    className=""
                    //   onClick={() => updateItem(item.variantId, 0)}
                  >
                    <FontAwesomeIcon
                      // @ts-ignore
                      icon={faTimes}
                      className="w-8 h-8 p-1 border text-palette-primary border-palette-primary hover:bg-palette-lighter"
                    />
                  </button>
                </td>
              </tr>
            ))}
          {resultSubtotal === 0 ? null : (
            <tr className="text-center">
              <td></td>
              <td className="px-4 py-4 text-base font-semibold text-gray-600 uppercase font-primary sm:px-6">
                Subtotal
              </td>
              <td className="px-4 py-4 text-lg font-medium font-primary text-palette-primary sm:px-6">
                <Price currency="$" num={resultSubtotal} numSize="text-xl" />
              </td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;
