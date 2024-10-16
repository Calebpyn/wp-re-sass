//Description: Controllers file for wp-18062 back end

//Supabase imports
const { createClient } = require("@supabase/supabase-js");

//Dotenv
require("dotenv").config();

//Supabase connection
const apiKey = process.env.SUPABASE_API_KEY;
const project = process.env.SUPABASE_DB_URL;
const supabase = createClient(project, apiKey);

const deletePropertyById = async (req, res) => {
  try {
    const propertyId = req.params.id;

    // Delete the property record
    const { error: deletePropertyError } = await supabase
      .from("property")
      .delete()
      .eq("id", propertyId);

    if (deletePropertyError) throw deletePropertyError;

    // Send success response
    res.json({
      message: "Property and related attributes deleted successfully",
    });
  } catch (error) {
    // Send error response
    res.status(500).json({ error: error.message });
  }
};

const deleteImagesById = async (req, res) => {
  try {
    const { error: deleteRowError } = await supabase
      .from("images_org_id")
      .delete()
      .eq("image_url", req.body.image_url)
      .eq("org_id", req.params.org_id);

    if (deleteRowError) {
      res.status(500).json({ deleteRowError });
    }

    const { error: deleteImageError } = await supabase.storage
      .from("property_images")
      .remove(`public/${req.body.storage_id}`);

    if (deleteImageError) {
      res.status(500).json({ deleteImageError });
    }

    res.json("OK");
  } catch (err) {
    res.status(500).json({ err });
  }
};

module.exports = {
  deletePropertyById,
  deleteImagesById,
};
