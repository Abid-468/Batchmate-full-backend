const express=require("express");
const router=express.Router();
const{get_all_alumni,add_alumni,get_alumni}=require("../controller/alumni_Controller");
const validateToken=require("../middleware/validationTokenHandler");
router.use(validateToken);

router.route("/").get(get_all_alumni).post(add_alumni);
router.route("/:id").get(get_alumni);
module.exports=router;