import express from "express";
import * as UserController from "../controllers/authController";
import validateSignUp from "../middleware/validations/validateSignup";

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - userName
 *        - password
 *        - confirmPassword
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        userName:
 *          type: string
 *          default: Jane Doe
 *        password:
 *          type: string
 *          default: stringPassword123
 *        confirmPassword:
 *          type: string
 *          default: stringPassword123
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        name:
 *          type: string
 */
router.post("/signup", validateSignUp, UserController.signUp);

router.post("/login", validateSignUp, UserController.login);

router.post("/logout", UserController.logout);

export default router;