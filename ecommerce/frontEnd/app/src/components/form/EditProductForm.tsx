import { useEffect, FC, useState, MouseEvent } from "react";
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
  const [deletedImagePositions, setDeletedImagePositions] = useState<number[]>(
    []
  );

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
    setValue("deletedImagePositions", deletedImagePositions);
  }, [uploadedImages, setValue, deletedImagePositions]);

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

  const addNewImages = (file: File) => {
    // Create a DataTransfer object and append the file
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const files = dataTransfer.files;

    // Find the missing positions
    let availablePositions = [0, 1, 2, 3].filter(
      (pos) => !existingImages.find((img) => img.position === pos)
    );

    const newImages: IUploadedImages[] = Array.from(files).map(
      (file, index) => {
        const position = availablePositions[index]; // Use the missing positions
        return {
          file,
          position,
        };
      }
    );

    setUploadedImages((prevState) => [...prevState, ...newImages]);

    // Update existingImages to display the new images immediately
    const updatedExistingImages = [...existingImages];

    newImages.forEach((newImage) => {
      updatedExistingImages.push({
        position: newImage.position,
        url: URL.createObjectURL(newImage.file),
      });
    });

    setExistingImages(updatedExistingImages);
  };

  // Update deletedImagePositions in handleDeleteImage
  const handleDeleteImage = (position: number) => {
    // Find the image at the given position
    const imageAtPosition = existingImages.find(
      (img) => img.position === position
    );

    // If the image exists in the server data (it has a URL)
    if (
      imageAtPosition &&
      imageAtPosition.url.startsWith("http://localhost:8000/")
    ) {
      // Mark it for deletion on the server
      setDeletedImagePositions((prevState) => [...prevState, position]);
    }

    // Always remove it from the client data
    const updatedExistingImages = existingImages.filter(
      (image) => image.position !== position
    );
    setExistingImages(updatedExistingImages);

    // Check if the image was in the uploaded images and remove it
    const updatedUploadedImages = uploadedImages.filter(
      (image) => image.position !== position
    );
    setUploadedImages(updatedUploadedImages);
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

    // Replace this part with the new code
    if (watchedPositionImage && watchedPositionImage.length > 0) {
      const positionImage = watchedPositionImage
        .filter(
          (img) =>
            !data.deletedImagePositions.includes(Number(img.position).valueOf()) // only add positions that are not in the deleted list
        )
        .map((img) => ({
          position: Number(img.position).valueOf(),
        }));
      formData.append("positionImage", JSON.stringify(positionImage));
    }

    if (deletedImagePositions && deletedImagePositions.length > 0) {
      const positionImage = deletedImagePositions.map((position) => ({
        position,
      }));
      formData.append("positionImage", JSON.stringify(positionImage));
    }

    // ตรวจสอบฟิลด์ที่ซ้ำกัน
    const formDataEntries = formData.entries();
    const newFormData = new FormData();

    for (const [name, value] of formDataEntries) {
      if (name === "positionImage" && newFormData.has(name)) {
        continue; // ข้ามการเพิ่มฟิลด์ที่ซ้ำกัน
      }

      newFormData.append(name, value); // เพิ่มฟิลด์ลงใน newFormData
    }

    const response = await productController().update(newFormData);
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
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="name"
        >
          Product Name
        </label>
        <input
          {...register("name", { required: true })}
          placeholder="Product Name"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="name"
        />
        {errors.name && <span>This field is required</span>}

        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="price"
        >
          Price
        </label>
        <input
          {...register("price", { required: true })}
          placeholder="Product Price"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="price"
        />
        {errors.price && <span>This field is required</span>}

        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          {...register("description", { required: true })}
          placeholder="Product Description"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="description"
        />
        {errors.description && <span>This field is required</span>}

        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="quantity"
        >
          Quantity
        </label>
        <input
          {...register("quantity", { required: true })}
          placeholder="Product Quantity"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="quantity"
        />
        {errors.quantity && <span>This field is required</span>}

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-500 rounded cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 !mt-[unset] relative">
        {existingImages.length < 4 && (
          <div className="col-start-3">
            <FileUploader
              maxSize={10}
              handleChange={(files) => {
                addNewImages(files);
              }}
              types={fileTypes}
              classes="!min-w-[195px]"
            />
          </div>
        )}

        <div className="col-span-3 grid grid-cols-2 gap-4">
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
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    handleDeleteImage(image.position);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};

export default EditProductForm;
