import { useEffect, FC, useState } from "react";
import { useForm } from "react-hook-form";
import { productController } from "services/apiController/product";
import { IProduct, IImageObject } from "services/typeApi";
import { FileUploader } from "react-drag-drop-files";
import { useSuccessToast } from "hooks/toast/useSuccessToast";

const fileTypes = ["JPG", "PNG"];

const AddProductForm: FC = () => {
  const [uploadedImages, setUploadedImages] = useState<IImageObject[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IProduct>();

  useEffect(() => {
    register("productImages");
  }, [register]);

  const onDrop = (files: File[]) => {
    const imageObjects: IImageObject[] = Array.from(files).map(
      (file, index) => ({
        file,
      })
    );
    setValue("productImages", imageObjects);
    setUploadedImages(imageObjects);
  };

  const onSubmit = async (data: IProduct) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "productImages") {
        data.productImages.forEach((image, index) => {
          formData.append("productImages", image.file);
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    const response = await productController().addProduct(formData);
    const { message } = response;
    useSuccessToast(message);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register("name", { required: true })}
        placeholder="Product Name"
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.name && <span>This field is required</span>}

      <input
        {...register("price", { required: true, valueAsNumber: true })}
        placeholder="Product Price"
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.price && <span>This field is required</span>}

      <textarea
        {...register("description", { required: true })}
        placeholder="Product Description"
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.description && <span>This field is required</span>}

      <input
        {...register("quantity", { required: true, valueAsNumber: true })}
        placeholder="Product Quantity"
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.quantity && <span>This field is required</span>}

      <FileUploader
        maxSize={10}
        handleChange={onDrop}
        types={fileTypes}
        multiple
      />
      {errors.productImages && <span>This field is required</span>}

      <div className="flex flex-wrap">
        {uploadedImages.map((image, index) => (
          <div key={index} className="w-1/4 p-1">
            <img
              src={URL.createObjectURL(image.file)}
              alt={`Uploaded ${index}`}
              className="w-full h-auto rounded"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full p-2 text-white bg-blue-500 rounded cursor-pointer"
      >
        Submit
      </button>
    </form>
  );
};

export default AddProductForm;
