import { useEffect, FC, useState } from "react";
import { useForm } from "react-hook-form";
import { productController } from "services/apiController/product";
import {
  IProductAdd,
  IImageObject,
  IProductUpdate,
  IUploadedImages,
} from "services/typeApi";
import { FileUploader } from "react-drag-drop-files";
import { useSuccessToast } from "hooks/toast/useSuccessToast";
import { useParams } from "react-router-dom";

const fileTypes = ["JPG", "PNG"];

type ParamTypes = {
  id: string;
};

export const EditProductForm: FC = () => {
  const [uploadedImages, setUploadedImages] = useState<IUploadedImages[]>([]);
  const [existingImages, setExistingImages] = useState([]);
  const { id } = useParams<ParamTypes>();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IProductUpdate>();

  useEffect(() => {
    register("productImages", { required: false });
    register("positionImage", { required: false });
    loadProduct();
  }, [register]);

  // Updated useEffect hook for updating form values
  useEffect(() => {
    setValue("productImages", uploadedImages);
    setValue(
      "positionImage",
      uploadedImages.map((img) => ({ position: img.position }))
    );
  }, [uploadedImages, setValue]);

  const loadProduct = async () => {
    const response = await productController().getById(id);
    if (response.status === 200) {
      setValue("name", response.data.name);
      setValue("price", response.data.price);
      setValue("description", response.data.description);
      setValue("quantity", response.data.quantity);
      setExistingImages(response.data.imagePaths);
    }
  };
  

  const handleUpdateImage = (file: File, position: number) => {
    const updatedImageObject = {
      file,
      position,
    };

    const updatedExistingImages = existingImages.map((img) => {
      if (img.position === position) {
        return { ...img, url: URL.createObjectURL(file) };
      } else {
        return img;
      }
    });
    setExistingImages(updatedExistingImages);

    const imageAtPosition = uploadedImages.find(
      (img) => img.position === position
    );

    let updatedUploadedImages;
    if (imageAtPosition) {
      updatedUploadedImages = uploadedImages.map((img) => {
        if (img.position === position) {
          return updatedImageObject;
        } else {
          return img;
        }
      });
    } else {
      updatedUploadedImages = [...uploadedImages, updatedImageObject];
    }

    setUploadedImages(updatedUploadedImages);
  };

  const addNewImages = (files: FileList) => {
    const newImages: IUploadedImages[] = Array.from(files).map(
      (file, index) => ({
        file,
        position: uploadedImages.length + index,
      })
    );

    setUploadedImages((prevState) => prevState.concat(newImages));
  };

  const handleDeleteImage = (position: number) => {
    const updatedExistingImages = existingImages.filter(
      (image) => image.position !== position
    );
    setExistingImages(updatedExistingImages);
    const updatedUploadedImages = uploadedImages.filter(
      (image) => image.position !== position
    );
    setUploadedImages(updatedUploadedImages);
    setValue(
      "positionImage",
      updatedExistingImages.map((image) => ({ position: image.position }))
    );
  };

  // Use watch to track the changes of productImages and positionImage
  const watchedProductImages = watch("productImages");
  const watchedPositionImage = watch("positionImage");

  // Then in the onSubmit function
  const onSubmit = async (data: IProductUpdate) => {
    const formData = new FormData();

    formData.append("id", id);
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("description", data.description);
    formData.append("quantity", data.quantity.toString());

    // Replace data.productImages with watchedProductImages and data.positionImage with watchedPositionImage
    if (watchedProductImages && watchedProductImages.length > 0) {
      watchedProductImages.forEach(
        (imageObject: IImageObject, index: number) => {
          const { file } = imageObject;
          formData.append("productImages", imageObject.file, file.name);
        }
      );
    }
    

    if (watchedPositionImage && watchedPositionImage.length > 0) {
      const positionImage = watchedPositionImage.map((img, index) => ({
        position: img.position,
      }));
      formData.append("positionImage", JSON.stringify(positionImage));
    }

    const response = await productController().update(formData);
    const { message, status } = response;
    if (status === 200) {
      useSuccessToast(message);
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

      <div className="grid grid-cols-2 gap-4 !mt-[unset]">
        {existingImages.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image.url}
              alt={`Existing ${index}`}
              className="w-full h-auto rounded"
            />
            <div className="absolute max-h-[35%] top-0 right-0 flex p-2 space-x-2">
              <FileUploader
                maxSize={10}
                handleChange={(files) => {
                  handleUpdateImage(files, image.position);
                }}
                types={fileTypes}
                classes="!min-w-[195px]"
              />
              <button
                type="button"
                className="p-1 text-white bg-red-500 rounded"
                onClick={() => handleDeleteImage(image.position)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {/* {uploadedImages.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(image.file)}
              alt={`Uploaded ${index}`}
              className="w-full h-auto rounded"
            />
            <div className="absolute bottom-0 right-0 flex p-2 space-x-2">
              <button
                type="button"
                className="p-1 text-white bg-red-500 rounded"
                onClick={() => handleDeleteImage(image.position)}
              >
                Delete
              </button>
            </div>
          </div>
        ))} */}
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

export default EditProductForm;
