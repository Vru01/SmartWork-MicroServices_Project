const express = require("express");
const { signup, login } = require("../controllers/authController");
const { getUsers, getUser, updateUser, deleteUser, getProfile } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware"); // import the middleware

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", auth(["manager","employee"]), getProfile);


// Protected routes (manager only)
router.get("/", auth(["manager"]), getUsers);
router.get("/:id", auth(["manager"]), getUser);
router.put("/:id", auth(["manager"]), updateUser);
router.delete("/:id", auth(["manager"]), deleteUser);

module.exports = router;
