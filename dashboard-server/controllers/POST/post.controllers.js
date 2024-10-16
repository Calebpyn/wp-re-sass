//Description: POST Controllers file for wp-re-sass back end

//Supabase imports
const { createClient } = require("@supabase/supabase-js");

//Dotenv
require("dotenv").config();

//Supabase connection
const apiKey = process.env.SUPABASE_API_KEY;
const project = process.env.SUPABASE_DB_URL;
const supabase = createClient(project, apiKey);

//Cleanning the file name for image upload
const sanitizeFilename = (filename) => {
  return filename
    .replace(/ /g, "_") // Replace spaces with underscores
    .replace(/[<>:"/\\|?*]/g, "") // Remove invalid characters
    .replace(/·/g, "_"); // Replace special character '·' with '_'
};

const callForUrl = async (fullPath) => {
  console.log(fullPath);
  const { data, error } = supabase.storage
    .from("property_images")
    .getPublicUrl(fullPath);

  if (error) {
    console.error("Supabase public URL error:", error.message);
    return { error: erorr.message };
  }
  return data;
};

//Save an image and images table row
const fullUploadImage = async (req, res) => {
  try {
    const file = req.file; // Access the uploaded file

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const sanitizedFilename = sanitizeFilename(file.originalname); // Sanitize filename

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("property_images")
      .upload(`public/${sanitizedFilename}`, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error("Supabase upload error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    // Generate the public URL for the uploaded image

    console.log(data);
    callForUrl(data.path).then(async (response) => {
      // Insert the image data along with the URL into the images_org_id table

      console.log("Hola:", response.publicUrl);

      if (response) {
        const { imgData, imgError } = await supabase
          .from("images_org_id")
          .insert([
            {
              storage_id: sanitizedFilename,
              image_location: req.params.image_location,
              org_id: req.params.org_id,
              image_url: response.publicUrl, // Store the image URL here
            },
          ]);

        if (imgError) {
          console.error("Supabase insert error:", imgError.message);
          return res.status(500).json({ error: imgError.message });
        }
      }
    });

    // Return success with the image URL
    res.status(200).json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  fullUploadImage,
};
