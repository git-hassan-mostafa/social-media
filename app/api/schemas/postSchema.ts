import mongoose, { Schema } from "mongoose"
//creating a new user schema
const PostSchema = new Schema({
    text: String,
    photo: String,
    photoPath:String,
    likes:{
        type:Number,
        default:0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: {
        type: [{
            text: String,
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        }],
        default: []
    },

}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

//exporting the model
export default mongoose.models.Post || mongoose.model('Post', PostSchema)