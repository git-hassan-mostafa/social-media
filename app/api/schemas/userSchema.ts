import mongoose, { Schema } from "mongoose"
//creating a new user schema
const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'email should be provided'],
        unique: [true, 'email is already used']
    },
    photo: String,
    name: {
        type: String,
        required: [true, 'name must be provided'],
        lowercase: true
    },
    savedPost: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }],
        default: []
    },
    likedPost: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }],
        default: []
    },

}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

//exporting the model
export default mongoose.models.User || mongoose.model('User', UserSchema)