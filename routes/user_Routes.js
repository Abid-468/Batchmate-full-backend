const express=require("express");
const {register_User,login_User,}=require("../controller/user_Controller");
const validateToken=require("../middleware/validationTokenHandler");
const router=express.Router();
router.post("/register",register_User);
router.post("/login",validateToken,login_User);


module.exports=router;