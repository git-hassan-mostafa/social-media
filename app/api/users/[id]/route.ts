import { NextResponse } from 'next/server';
import connect from '../../schemas/DBConnection';
import userSchema from '../../schemas/userSchema';
import postSchema from '../../schemas/postSchema';
import { isEqual } from 'lodash';

export async function GET(req: Request, { params: { id } }: { params: { id: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const populate = searchParams.get('populate');
        const user = populate ? await userSchema.findById(id).populate('likedPost').populate('savedPost') : await userSchema.findById(id)
        if (!user) return NextResponse.json({ data: null, status: 'not-success' })
        return NextResponse.json({ data: user, status: 'success' })
    } catch (error) {
        return NextResponse.json({ data: error, status: 'error' })
    }
}


export async function DELETE(req: Request, { params: { id } }: { params: { id: string } }) {
    try {
        await connect();
        const deleted = await userSchema.findByIdAndDelete(id);
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('postId');
        await postSchema.deleteMany({ post: postId })
        if (!deleted) return NextResponse.json({ message: 'this user does not exist', status: 'not-success' })
        return NextResponse.json({ message: 'user has been deleted successfully', status: 'success' })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ data: error, status: 'error' })
    }
}


export async function PATCH(req: Request, { params: { id } }: { params: { id: string } }) {
    try {
        await connect();
        const { name, photo, type } = await req.json();
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('postId');
        if (type === 'save') {
            if (!postId) return NextResponse.json({ message: "post id is required", status: "not-success" })
            const post = await postSchema.findById(postId)
            const user = await userSchema.findById(id);
            if (user.savedPost.find((c: { _id: { toString: () => any; }; }) => c._id.toString() === post._id.toString()))
                return NextResponse.json({ message: 'post already saved', status: 'not-success' })
            user.savedPost.push(post);
            await user.save();
            await post.save();
            return NextResponse.json({ message: 'post saved successfully', status: 'success' })
        }
        if (type === 'unsave') {
            const post = await postSchema.findById(postId)
            const user = await userSchema.findById(id);
            const oldSavedPost = user.savedPost
            const newSavedPost = user.savedPost = user.savedPost.filter((c: { _id: any; }) => c._id.toString() !== post._id.toString())
            if (isEqual(oldSavedPost, newSavedPost)) return NextResponse.json({ message: 'post already unsaved', status: 'not-success' })
            await user.save();
            await post.save();
            return NextResponse.json({ message: 'post unsaved successfully', status: 'success' })
        }
        if (!name && !photo) return NextResponse.json({ message: 'user has been updated successfully', status: 'success' })
        await userSchema.findByIdAndUpdate(id, {
            name, photo
        })
        return NextResponse.json({ message: 'user has been updated successfully', status: 'success' })
    } catch (error) {
        return NextResponse.json({ data: error, status: 'error' })
    }
}