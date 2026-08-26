import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access and refresh token"
        )
    }
}

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

const logginUser = asyncHandler( async(req, res) => {
    const {email, password} = req.body

    if(!email){
        throw new ApiError(400, "email is required")
    }
    if(!password){
        throw new ApiError(400, "password is required")
    }

    const user = await User.findOne({email})
    if(!user){
        throw new ApiError(404, "email incorrect or user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(400, "Invalid Password")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedinUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedinUser, accessToken, refreshToken
            },
            "user logged in successfully"
        )
    )
})

export { 
    registerUser,
    logginUser
}