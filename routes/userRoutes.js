const express = require("express");
const {
  signup,
  setPreferences,
  getMatches,
} = require("../controllers/userController");
const router = express.Router();

router.post("/signup", signup);
router.post("/preferences", setPreferences);
router.get("/matches/:userId", getMatches);

module.exports = router;
