//Description: GET Controllers file for wp-re-sass back end

//Supabase imports
const { createClient } = require("@supabase/supabase-js");

//Dotenv
require("dotenv").config();

//Supabase connection
const apiKey = process.env.SUPABASE_API_KEY;
const project = process.env.SUPABASE_DB_URL;
const supabase = createClient(project, apiKey);

const getImagesByOrgId = async (req, res) => {
  try {
    const { data: images, error: imagesError } = await supabase
      .from("images_org_id")
      .select("*")
      .eq("org_id", req.params.id)
      .eq("image_location", req.params.location);

    if (imagesError) throw imagesError;

    if (images.length === 0) {
      return res.json([]);
    }

    return res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPropertiesByOrgId = async (req, res) => {
  try {
    const { data: properties, error: propertiesError } = await supabase
      .from("property")
      .select(
        "id, created_at, name, name_es, desc, desc_es, type, price, currency, images, lat, lng, address, atts_en, atts_es"
      )
      .eq("org_id", req.params.id);

    if (propertiesError) throw propertiesError;

    if (properties.length === 0) {
      return res.json([]);
    }

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDistinctImageLocationsByOrgId = async (req, res) => {
  try {
    const { data: locations, error: locationsError } = await supabase
      .from("images_org_id")
      .select("image_location")
      .eq("org_id", req.params.id);

    if (locationsError) throw locationsError;

    if (locations.length === 0) {
      return res.json([]);
    }

    const distinctLocations = [
      ...new Set(locations.map((location) => location.image_location)),
    ];

    res.json(distinctLocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getImagesByOrgId,
  getAllPropertiesByOrgId,
  getDistinctImageLocationsByOrgId,
};
