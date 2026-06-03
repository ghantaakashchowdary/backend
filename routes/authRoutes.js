const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");

const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.post("/register", register);
router.post("/login", login);

router.get(
  "/admin",
  auth,
  role("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);

module.exports = router;