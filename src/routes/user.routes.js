import {Router} from 'express';
import {changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetail, updateUserAvatar, updateUserCoverImage} from '../controllers/user.controller.js'
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
router.route("/change-current-password").post(verifyJWT ,changeCurrentPassword)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/get-user").get(verifyJWT , getCurrentUser)
router.route("/update-account-detail").patch(verifyJWT , updateAccountDetail)
router.route("/update-user-avatar").patch(verifyJWT , upload.single("avatar") , updateUserAvatar)
router.route("/update-cover-image").patch(verifyJWT , upload.single("coverImage"), updateUserCoverImage)
router.route("/channel/:username").get(verifyJWT , getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)

export default router