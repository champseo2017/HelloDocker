import { useState, useRef, useEffect } from "react";
import Image from "./Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface IProductImage {
  imagePaths: {
    position: number;
    url: string;
  }[];
}

const ProductImage = (props: IProductImage) => {
  const { imagePaths } = props;

  const [mainImg, setMainImg] = useState("");
  console.log("mainImg", mainImg);
  const ref = useRef(null);

  const scroll = (scrollOffset) => {
    if (ref.current) {
      ref.current.scrollLeft += scrollOffset;
    }
  };

  useEffect(() => {
    if (imagePaths.length) {
      setMainImg(imagePaths[0].url);
    }
    return () => {};
  }, [imagePaths]);

  return (
    <div className="w-full md:w-1/2 max-w-md border border-palette-lighter bg-white rounded shadow-lg">
      <Image src={mainImg} alt="" className="h-96" />
      <div className="relative flex border-t border-palette-lighter">
        <button
          aria-label="left-scroll"
          className="h-32 bg-palette-lighter hover:bg-palette-light  absolute left-0 z-10 opacity-75"
          onClick={() => scroll(-300)}
        >
          <FontAwesomeIcon
            // @ts-ignore
            icon={faArrowLeft}
            className="w-3 mx-1 text-palette-primary"
          />
        </button>
        <div
          ref={ref}
          style={{ scrollBehavior: "smooth" }}
          className="flex space-x-1 w-full overflow-auto border-t border-palette-lighter"
        >
          {imagePaths.length &&
            imagePaths.map((imgItem, index) => (
              <button
                key={index}
                className="relative w-40 h-32 flex-shrink-0 rounded-sm "
                onClick={() => setMainImg(imgItem.url)}
              >
                <Image
                  src={imgItem.url}
                  alt={""}
                  className=""
                  style={{
                    display: "block",
                    overflow: "hidden",
                    position: "absolute",
                    inset: "0px",
                    boxSizing: "border-box",
                    margin: "0px",
                  }}
                />
              </button>
            ))}
        </div>
        <button
          aria-label="right-scroll"
          className="h-32 bg-palette-lighter hover:bg-palette-light  absolute right-0 z-10 opacity-75"
          onClick={() => scroll(300)}
        >
          <FontAwesomeIcon
            // @ts-ignore
            icon={faArrowRight}
            className="w-3 mx-1 text-palette-primary"
          />
        </button>
      </div>
    </div>
  );
};

export default ProductImage;
