const express=require("express");
const {register_User,login_User,}=require("../controller/user_Controller");
const router=express.Router();
const validateToken=require("../middleware/validationTokenHandler");
router.post("/register",register_User);
router.post("/login",login_User);
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
});
router.get("/current", validateToken, (req, res) => {
    res.json(req.user);
});
module.exports=router;