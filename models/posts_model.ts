import mongoose, { Document, Schema } from 'mongoose';

interface IPost extends Document {
    title: string;
    content?: string;
    owner: string;
}

const postSchema: Schema<IPost> = new Schema({
    title: {   
        type: String,
        required: true, 
    },
    content: {
        type: String,
        default: '', // ברירת מחדל
    },
    owner: {
        type: String,
        required: true,
    },
});

const Post = mongoose.model<IPost>('Post', postSchema);
export default Post;
