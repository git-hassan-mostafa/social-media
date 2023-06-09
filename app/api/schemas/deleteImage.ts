import mongoose, { Schema } from "mongoose"
//creating a new user schema
const DeleteSchema = new Schema({
    imagePath:String
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

//exporting the model
export default mongoose.models.DeleteImage || mongoose.model('DeleteImage', DeleteSchema)