import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res) =>{
   // get user details from frontend
   // validation - not empty
   // check if user already exists: - usename, email
   // check for image, check for avatar
   // upload them to cloudnery, avatar
   // create user object - create entry in db
   // remove password and refresh token filed from response
   // check for user creation
   // return res

   // step 1
   const {username, email, fullName, password} = req.body

    // step 2
    //empty condition checking 
   if(
    [username, email, fullName, password].some((filed) =>
    filed?.trim() === "")
   ){
    throw new ApiError(400, "All field are required")
   }

   // step 3
   const exitedUser = User.findOne({
    $or: [{ username }, { email }]
   })

   if(exitedUser){
    throw new ApiError(409, "User with email or Username already exists")
   }

   // step 4
   const avatarLocalPath =  req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required")
   }

   // step 5
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
    throw new ApiError(400, "Avatar file is required")
   }

   //step 6
   const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase() 
   })

   //step 7
   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )
   //step 8
   if(!createdUser){
    throw new ApiError(500, "Something Went Wrong While Registering the user")
   }

   // step 9
   return res.status(201).json(
    new ApiResponse(200, createdUser,"User Register succesfully")
   )

})

export {registerUser}