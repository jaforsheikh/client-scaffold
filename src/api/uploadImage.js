const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

const uploadImage = async (imageFile) => {
  const imageApiKey = import.meta.env.VITE_IMGBB_API_KEY;

  if (!imageApiKey) {
    throw new Error("ImgBB API key is missing.");
  }

  if (!imageFile) {
    throw new Error("Please select an avatar image.");
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${IMGBB_UPLOAD_URL}?key=${imageApiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data?.success) {
    throw new Error(data?.error?.message || "Image upload failed.");
  }

  return data.data.display_url || data.data.url;
};

export default uploadImage;