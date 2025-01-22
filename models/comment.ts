import mongoose, { Document, Schema } from "mongoose";

interface IComment extends Document {
    postId: mongoose.Types.ObjectId;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema: Schema<IComment> = new Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Comment = mongoose.model<IComment>('Comment', commentSchema);
export default Comment;
