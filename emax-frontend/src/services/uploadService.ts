import api from "./api";

export const uploadProductImage = async (
  file: File
) => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await api.post(
    "/upload/product",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};