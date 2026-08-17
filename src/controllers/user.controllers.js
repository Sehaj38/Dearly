import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const registerUser = asyncHandler( async(req, res) =>{
    const {username, fullName, email, password} = req.body

    if([username,fullName,email,password].some( (field) => (field?.trim() === "" ))){
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{email},{username}]
    })
    if(existingUser){
        throw new ApiError(409, "User with same email or username already exists")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullName,
        email,
        password
    })

    const createrUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createrUser){
        throw new ApiError(500, "Something went wrong");
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            200, createrUser, "User registered successfully"
        )
    )
})

export { registerUser }