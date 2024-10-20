//Description: Controllers file for wp-18062 back end

//Supabase imports
const { createClient } = require("@supabase/supabase-js");

//Dotenv
require("dotenv").config();

//Supabase connection
const apiKey = process.env.SUPABASE_API_KEY;
const project = process.env.SUPABASE_DB_URL;
const supabase = createClient(project, apiKey);

//Functions
// Function to sanitize filenames
const sanitizeFilename = (filename) => {
  return filename
    .replace(/ /g, "_") // Replace spaces with underscores
    .replace(/[<>:"/\\|?*]/g, "") // Remove invalid characters
    .replace(/·/g, "_"); // Replace special character '·' with '_'
};

//GET
//  Get all properties
const getAllProperties = async (req, res) => {
  try {
    // Fetch all properties
    const { data: properties, error: propertiesError } = await supabase
      .from("property")
      .select(
        "id, created_at, name, name_es, desc, desc_es, type, price, currency, images, lat, lng, address, atts_en, atts_es"
      );

    if (propertiesError) throw propertiesError;

    // If there are no properties, return an empty array
    if (properties.length === 0) {
      return res.json([]);
    }

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get all properties
const getLastTenProperties = async (req, res) => {
  try {
    // Fetch all properties
    const { data: properties, error: propertiesError } = await supabase
      .from("property")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (propertiesError) throw propertiesError;

    // If there are no properties, return an empty array
    if (properties.length === 0) {
      return res.json([]);
    }

    // Fetch all related attributes for the properties
    const propertyIds = properties.map((property) => property.id);
    const { data: attributes, error: attributesError } = await supabase
      .from("att")
      .select("*")
      .in("fk_property", propertyIds);

    if (attributesError) throw attributesError;

    // Combine properties with their related attributes
    const propertiesWithAttributes = properties.map((property) => ({
      ...property,
      atts: attributes.filter((att) => att.fk_property === property.id),
    }));

    // Send the combined data
    res.json(propertiesWithAttributes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get all properties
const getPropertyById = async (req, res) => {
  try {
    // Fetch all properties
    const { data: properties, error: propertiesError } = await supabase
      .from("property")
      .select("*")
      .eq("id", req.params.id);

    if (propertiesError) throw propertiesError;

    // If there are no properties, return an empty array
    if (properties.length === 0) {
      return res.json([]);
    }

    res.json(properties);

    // // Fetch all related attributes for the properties
    // const propertyIds = properties.map((property) => property.id);
    // const { data: attributes, error: attributesError } = await supabase
    //   .from("att")
    //   .select("*")
    //   .in("fk_property", propertyIds);

    // if (attributesError) throw attributesError;

    // // Combine properties with their related attributes
    // const propertiesWithAttributes = properties.map((property) => ({
    //   ...property,
    //   atts: attributes.filter((att) => att.fk_property === property.id),
    // }));

    // // Send the combined data
    // res.json(propertiesWithAttributes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get an all images by fk
const getAllImagesById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("image")
      .select("*")
      .eq("fk_property", id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get list of allowed users
const getAllowedUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from("allowed_user").select("*");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get all for sale
const getAllForSale = async (req, res) => {
  try {
    // Fetch all properties of type 'For Sale'
    const { data: properties, error: propertiesError } = await supabase
      .from("property")
      .select("*")
      .eq("type", "For Sale");

    if (propertiesError) throw propertiesError;

    // If there are no properties, return an empty array
    if (properties.length === 0) {
      return res.json([]);
    }

    res.json(properties);
    // // Fetch all related attributes for the properties
    // const propertyIds = properties.map((property) => property.id);
    // const { data: attributes, error: attributesError } = await supabase
    //   .from("att")
    //   .select("*")
    //   .in("fk_property", propertyIds);

    // if (attributesError) throw attributesError;

    // // Combine properties with their related attributes
    // const propertiesWithAttributes = properties.map((property) => ({
    //   ...property,
    //   atts: attributes.filter((att) => att.fk_property === property.id),
    // }));

    // Send the combined data
    // res.json(propertiesWithAttributes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get all for rent
const getAllForRent = async (req, res) => {
  try {
    // Fetch all properties of type 'For Rent'
    const { data: properties, error: propertiesError } = await supabase
      .from("property")
      .select("*")
      .in("type", ["For Rent", "AirBnB"]);

    if (propertiesError) throw propertiesError;

    // If there are no properties, return an empty array
    if (properties.length === 0) {
      return res.json([]);
    }

    res.json(properties);

    // // Fetch all related attributes for the properties
    // const propertyIds = properties.map((property) => property.id);
    // const { data: attributes, error: attributesError } = await supabase
    //   .from("att")
    //   .select("*")
    //   .in("fk_property", propertyIds);

    // if (attributesError) throw attributesError;

    // // Combine properties with their related attributes
    // const propertiesWithAttributes = properties.map((property) => ({
    //   ...property,
    //   atts: attributes.filter((att) => att.fk_property === property.id),
    // }));

    // // Send the combined data
    // res.json(propertiesWithAttributes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get all for Airbnb
const getAllForAirBnb = async (req, res) => {
  try {
    // Fetch all properties of type 'AirBnB'
    const { data: properties, error: propertiesError } = await supabase
      .from("property")
      .select("*")
      .eq("type", "AirBnB");

    if (propertiesError) throw propertiesError;

    // If there are no properties, return an empty array
    if (properties.length === 0) {
      return res.json([]);
    }

    // Fetch all related attributes for the properties
    const propertyIds = properties.map((property) => property.id);
    const { data: attributes, error: attributesError } = await supabase
      .from("att")
      .select("*")
      .in("fk_property", propertyIds);

    if (attributesError) throw attributesError;

    // Combine properties with their related attributes
    const propertiesWithAttributes = properties.map((property) => ({
      ...property,
      atts: attributes.filter((att) => att.fk_property === property.id),
    }));

    // Send the combined data
    res.json(propertiesWithAttributes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get all images from the bucket
const getAllImages = async (req, res) => {
  try {
    const { data, error } = await supabase.storage
      .from("property_images")
      .list("public", { limit: 1000, offset: 0 });
    if (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ error: error.message });
    }
    // Generate public URLs for each image
    const images = [];

    for (let i = 0; i < data.length; i++) {
      let temporalObj = {
        isClicked: false,
        url: supabase.storage
          .from("property_images")
          .getPublicUrl(`public/${data[i].name}`).data.publicUrl,
      };
      images.push(temporalObj);
    }

    res.json(images);
  } catch (error) {
    // Send error response
    res.status(500).json({ error: error.message });
  }
};

//Get all properties locations
const getAllLocations = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("property")
      .select("id, name, lat, lng");

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.json([]);
    }

    const locations = data.map(({ id, name, lat, lng }) => ({
      id,
      name,
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      },
    }));

    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//POST
//  Post a new property
const newProperty = async (req, res) => {
  try {
    console.log(req.body.images);
    // Insert the new property and get its ID
    const { data: propertyData, error: propertyError } = await supabase
      .from("property")
      .insert([
        {
          name_es: req.body.name_es,
          name: req.body.name,
          desc_es: req.body.desc_es,
          desc: req.body.desc,
          price: req.body.price,
          type: req.body.type,
          currency: req.body.currency,
          images: req.body.images,
          lat: req.body.lat,
          lng: req.body.lng,
          address: req.body.address,
          atts_es: req.body.atts_es,
          atts_en: req.body.atts_en,
        },
      ])
      .select("id");

    if (propertyError) throw propertyError;

    // Send success response
    res.status(201).json({
      message: "Property created successfully",
    });
  } catch (error) {
    // Send error response
    res.status(500).json({ error: error.message });
  }
};

//  Post a new access
const newAccess = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("allowed_user")
      .insert([
        {
          email: req.body.email,
        },
      ])
      .select("id");
    if (error) throw error;
    res
      .status(201)
      .json({ message: "Access created successfully", id: data[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Save an image
const uploadImage = async (req, res) => {
  try {
    const file = req.file; // Access the uploaded file

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const sanitizedFilename = sanitizeFilename(file.originalname); // Sanitize filename

    const { data, error } = await supabase.storage
      .from("property_images")
      .upload(`public/${sanitizedFilename}`, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error("Supabase upload error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: "Image uploaded successfully." });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: error.message });
  }
};

//  Save an image in the db
const newImage = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.file;
  const filePath = `./${file.name}`;

  try {
    const { data, error } = await supabase.storage
      .from("property_images")
      .upload(filePath, file.data);

    if (error) {
      throw error;
    }

    res.send({ message: "File uploaded successfully", data });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

//PUT
// Update an existing property
const updateProperty = async (req, res) => {
  try {
    // Update the property record
    const { error: updateError } = await supabase
      .from("property")
      .update({
        name_es: req.body.name_es,
        name: req.body.name,
        desc_es: req.body.desc_es,
        desc: req.body.desc,
        price: req.body.price,
        type: req.body.type,
        currency: req.body.currency,
        images: req.body.images,
        lat: req.body.lat,
        lng: req.body.lng,
        atts_en: req.body.atts_en,
        atts_es: req.body.atts_es,
      })
      .eq("id", req.params.id);

    if (updateError) throw updateError;

    // Send success response
    res.json({ message: "Property updated successfully" });
  } catch (error) {
    // Send error response
    res.status(500).json({ error: error.message });
  }
};

//DELETE
// Delete a property
const deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;

    // Start a transaction
    const { error: deleteAttsError } = await supabase
      .from("att")
      .delete()
      .eq("fk_property", propertyId);

    if (deleteAttsError) throw deleteAttsError;

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

// Delete access
const deleteAccess = async (req, res) => {
  try {
    const { error } = await supabase
      .from("allowed_user")
      .delete()
      .eq("id", req.params.id);
    if (error) {
      res.send(error);
    }
    res.send("deleted!!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Delete images
const deleteImages = async (req, res) => {
  const { filenames } = req.body;

  try {
    const { data, error } = await supabase.storage
      .from("property_images")
      .remove(filenames.map((name) => `public/${name}`));

    if (error) {
      console.error("Error deleting images:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: "Images deleted successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllImagesById,
  newImage,
  newProperty,
  getAllProperties,
  updateProperty,
  deleteProperty,
  deleteImages,
  getAllowedUsers,
  newAccess,
  uploadImage,
  deleteAccess,
  getAllForSale,
  getAllForRent,
  getAllForAirBnb,
  getPropertyById,
  getAllImages,
  getLastTenProperties,
  getAllLocations,
};
