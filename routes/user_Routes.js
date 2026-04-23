const express=require("express");
const {register_User,login_User,}=require("../controller/user_Controller");
const router=express.Router();
const validateToken=require("../middleware/validationTokenHandler");

function getClearCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production";
    const sameSite = process.env.COOKIE_SAMESITE || (isProduction ? "none" : "lax");
    const secure = sameSite === "none" ? true : isProduction;
    return {
        httpOnly: true,
        sameSite,
        secure,
    };
}

router.post("/register",register_User);
router.post("/login",login_User);
router.post("/logout", (req, res) => {
    res.clearCookie("token", getClearCookieOptions());
    res.status(200).json({ message: "Logout successful" });
});
router.get("/current", validateToken, (req, res) => {
    res.json(req.user);
});
module.exports=router;