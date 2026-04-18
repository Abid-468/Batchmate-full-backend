const express=require("express");
const router=express.Router();
const{get_alumni,add_alumni,get_all_alumni,update_Alumni ,delete_Alumni}=require("../controller/alumni_Controller");
const validateToken=require("../middleware/validationTokenHandler");

// Alumni endpoints are protected and require a valid token.
router.route("/").get(validateToken, get_all_alumni).post(validateToken,add_alumni);
router.route("/:id").get(validateToken,get_alumni).put(validateToken, update_Alumni).delete(validateToken, delete_Alumni);
module.exports=router;