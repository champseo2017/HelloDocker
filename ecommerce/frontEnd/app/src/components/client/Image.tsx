import { FC } from "react";

const Image: FC<{
  src: string;
  alt: string;
  className: string;
  style?: any;
}> = ({ src, alt, className, style }) => {
  return (
    <div style={style} className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover transform duration-500 ease-in-out hover:scale-110"
      />
    </div>
  );
};

export default Image;
