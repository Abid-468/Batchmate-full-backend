const express=require("express");
const router=express.Router();
const{get_alumni,add_alumni,get_all_alumni,update_Alumni ,delete_Alumni}=require("../controller/alumni_Controller");
const validateToken=require("../middleware/validationTokenHandler");
router.route("/").get(get_all_alumni).post(validateToken,add_alumni);
router.route("/:id").get(validateToken,get_alumni);
router.put("/:id",validateToken, update_Alumni);
router.delete("/:id",validateToken, delete_Alumni);
module.exports=router;