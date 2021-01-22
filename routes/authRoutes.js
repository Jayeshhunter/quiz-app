const { Router } = require("express");
const authController = require("../controllers/authController.js");
const router = Router();

router.get("/signup", authController.signup_get);
router.get("/signAdminup", authController.signAdminup_get);
router.post("/signup", authController.signup_post);
router.post("/signAdminup", authController.signAdminup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/loginAdm", authController.loginAdm_get);
router.post("/loginAdm", authController.loginAdm_post);
module.exports = router;
