import { useEffect, FC, useState } from "react";
import { useForm } from "react-hook-form";
import { productController } from "services/apiController/product";
import { IProductAdd, IImageObject } from "services/typeApi";
import { FileUploader } from "react-drag-drop-files";
import { useSuccessToast } from "hooks/toast/useSuccessToast";

const fileTypes = ["JPG", "PNG"];

const AddProductForm: FC = () => {
  const [uploadedImages, setUploadedImages] = useState<IImageObject[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IProductAdd>();

  useEffect(() => {
    register("productImages", { required: true });
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

  const onSubmit = async (data: IProductAdd) => {
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
    const response = await productController().add(formData);
    const { message, status } = response;
    if (status === 200) {
      useSuccessToast(message);
      reset()
      setUploadedImages([]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 md:grid md:grid-cols-2 md:gap-4"
    >
      <div>
        <input
          {...register("name", { required: true })}
          placeholder="Product Name"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <span>This field is required</span>}

        <input
          {...register("price", { required: true })}
          placeholder="Product Price"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.price && <span>This field is required</span>}

        <textarea
          {...register("description", { required: true })}
          placeholder="Product Description"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && <span>This field is required</span>}

        <input
          {...register("quantity", { required: true })}
          placeholder="Product Quantity"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.quantity && <span>This field is required</span>}
      </div>

      <div>
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
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-500 rounded cursor-pointer"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
