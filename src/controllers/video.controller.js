import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  detailsFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
  const { title, description } = req.body;
  console.log(title, description);

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  if (!description) {
    throw new ApiError(400, "Description is required");
  }

  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is missing");
  }

  const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnailFile) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const videoLocalPath = req.files?.videoFile[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is missing");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);

  if (!videoFile) {
    throw new ApiError(400, "Video is required");
  }

  const duration = videoFile?.duration;
  console.log(duration);

  const video = await Video.create({
    videoFile: {
      url: videoFile.url,
      public_id: videoFile.public_id,
    },
    thumbnail: {
      url: thumbnailFile.url,
      public_id: thumbnailFile.public_id,
    },
    title,
    description,
    duration,
    owner: req.user?._id,
  });

  const videoUser = await Video.findById(video._id).select(
    "-videoFile.public_id -thumbnail.public_id"
  );

  if (!videoUser) {
    throw new ApiError(500, "Error while uploading the video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videoUser, "Video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  if (!videoId || videoId.trim() === "") {
    throw new ApiError(400, "videoId is required");
  }

  const video = await Video.findById(videoId)
    .populate("owner", "fullname username avatar.url")
    .select("-videoFile.public_id -thumbnail.public_id");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched Successfully"));
});

const updateVideodetails = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  if (!videoId || videoId.trim() === "") {
    throw new ApiError(400, "videoId is required");
  }

  const { title, description } = req.body;


  if (!(title || description)) {
    throw new ApiError(400, "Nothing to update");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
      },
    },
    { new: true }
  ).select("-videoFile.public_id -thumbnail.public_id");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "User updated successfully"));
});

const updateVideoThumbnail = asyncHandler(async(req , res) =>{
    const {videoId} = req.params

    if (!videoId || videoId.trim() === "") {
        throw new ApiError(400 , "videoId is required")
    }
    const thumbnailLocalPath = req.file?.path;

    if (!thumbnailLocalPath) {
        throw new ApiError(400 , "Thumbnail file is missing")
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail?.url) {
        throw new ApiError(400 , "Error while uploading")
    }

    const currentVideo = await Video.findById(videoId);
  
    if (currentVideo?.thumbnail?.public_id) {
      await deleteFromCloudinary(currentVideo.thumbnail.public_id);
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set : {
                thumbnail: {
                    url: thumbnail?.url,
                    public_id: thumbnail?.public_id,
                  },
            }
        },
        {new : true}
    ).select("-videoFile.public_id -thumbnail.public_id")

    return res
    .status(200)
    .json(new ApiResponse(200 , video , "Thumbnail updated succesfully"))


})

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideodetails,
  updateVideoThumbnail,
  deleteVideo,
  togglePublishStatus,
};
