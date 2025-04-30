import {Router} from 'express';
import {changeCurrentPassword, getCurrentUser, loginUser, refreshAccessToken, registerUser, updateAccountDetail, updateUserAvatar, updateUserCoverImage} from '../controllers/user.controller.js'
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router()


router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount : 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)
router.route("/change-current-password").post(changeCurrentPassword)

// secured routes
router.route("/logout").post(verifyJWT, loginUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/get-user").get(verifyJWT , getCurrentUser)
router.route("/update-account-detail").post(verifyJWT , updateAccountDetail)
router.route("/update-user-avatar").post(verifyJWT , upload.fields([{name : "avatar" , maxCount : 1}]) , updateUserAvatar)
router.route("/update-cover-image").post(verifyJWT , upload.fields([{name : "coverImage" , maxCount : 1}]), updateUserCoverImage)

export default router