import axios from "axios";

export const handleAllImages = async (folder: string) => {
  try {
    const response = await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/get_images/testhash/${folder}`
      )
      .catch((err) => {
        console.log(err, "Axios error");
      });
    if (response) {
      return response.data.map((item: any) => ({
        ...item,
        isClicked: false,
      }));
    } else {
      return "err";
    }
  } catch (err) {
    return "err";
  }
};

export const handleAllFolders = async () => {
  try {
    const response = await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/get_image_locations/testhash`
      )
      .catch((err) => {
        console.log(err, "Axios error");
      });
    if (response) {
      return response.data;
    } else {
      return "err";
    }
  } catch (err) {
    return "err";
  }
};

export default {
  handleAllImages,
  handleAllFolders,
};
