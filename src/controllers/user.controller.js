import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async(req,res) =>{
    res.status(200).json({
        message : "Coding is fun sab ho jaayega"
    })
})

export {registerUser}