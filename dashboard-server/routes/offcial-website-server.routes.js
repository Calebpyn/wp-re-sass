//Description: Routes file for wp-18062 back end

//Imports
const { Router } = require("express");
const router = new Router();
const upload = require("../middlewares/MulterSetUp");

//Controllers
const {
  newProperty,
  getAllProperties,
  updateProperty,
  newImage,
  getAllImagesById,
  deleteProperty,
  getAllowedUsers,
  newAccess,
  deleteAccess,
  getAllForSale,
  getAllForRent,
  getAllForAirBnb,
  getPropertyById,
  getAllImages,
  deleteImages,
  uploadImage,
  getLastTenProperties,
  getAllLocations,
} = require("../controllers/offcial-website-server.controllers");
const {
  getImagesByOrgId,
  getAllPropertiesByOrgId,
  getDistinctImageLocationsByOrgId,
} = require("../controllers/GET/get.controllers");
const { fullUploadImage } = require("../controllers/POST/post.controllers");
const {
  deletePropertyById,
  deleteImagesById,
} = require("../controllers/DELETE/delete.controllers");

//GET
//  Get all properties
router.get("/all_properties", getAllProperties);
//  Get last ten properties
router.get("/last_ten_properties", getLastTenProperties);
//  Get property by id
router.get("/property/:id", getPropertyById);
//  Get images by id
router.get("/all_images/:id", getAllImagesById);
//  Get allowed users
router.get("/allowed", getAllowedUsers);
//  Get for sale properties
router.get("/for_sale", getAllForSale);
//  Get for rent properties
router.get("/for_rent", getAllForRent);
//  Get airbnb properties
router.get("/for_airbnb", getAllForAirBnb);
//  Get all images from bucket
router.get("/all_bucket_images", getAllImages);
//  Get all locations
router.get("/all_locations", getAllLocations);

//POST
//  Create new property
router.post("/new_property", newProperty);
//  Post new image
router.post("/new_image", newImage);
//  Post a new acces
router.post("/new_access", newAccess);
//Delete images
router.post("/delete_images", deleteImages);
//New image
router.post("/upload_image", upload.single("file"), uploadImage);

//PUT
// Update an existing property
router.put("/update_property/:id", updateProperty);

//DELETE
// Delete a property
router.delete("/delete_property/:id", deleteProperty);
// Delete access
router.delete("/delete_access/:id", deleteAccess);

//New Routes
//GET
router.get("/get_images/:id/:location", getImagesByOrgId);
router.get("/get_properties/:id", getAllPropertiesByOrgId);
router.get("/get_image_locations/:id", getDistinctImageLocationsByOrgId);

//DELETE
router.delete("/delete_property_by_id/:id", deletePropertyById);
router.delete("/delete_image/:org_id", deleteImagesById);

//POST
router.post(
  "/full_upload_image/:image_location/:org_id",
  upload.single("file"),
  fullUploadImage
);

module.exports = router;
