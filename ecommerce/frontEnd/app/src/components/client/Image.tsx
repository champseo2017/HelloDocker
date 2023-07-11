
const Image = ({ src, alt, className }) => {
  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover transform duration-500 ease-in-out hover:scale-110"
      />
    </div>
  );
};

export default Image;
