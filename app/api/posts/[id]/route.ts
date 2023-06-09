import { NextResponse } from 'next/server';
import connect from '../../schemas/DBConnection';
import postSchema from '../../schemas/postSchema';
import userSchema from '../../schemas/userSchema';
import { isEqual } from 'lodash';

export async function GET(req: Request, { params: { id } }: { params: { id: string } }) {
    try {
        const post = await postSchema.findById(id)
        if (!post) return NextResponse.json({ data: null, status: 'not-success' })
        return NextResponse.json({ data: post, status: 'success' })
    } catch (error) {
        return NextResponse.json({ data: error, status: 'error' })
    }
}


export async function DELETE(req: Request, { params: { id } }: { params: { id: string } }) {
    try {
        await connect();
        const deleted = await postSchema.findByIdAndDelete(id);
        console.log(deleted._id.toString())
        const users = await userSchema.find({
            $or: [
                {
                    likedPost: deleted._id.toString()
                },
                {
                    savedPost: deleted._id.toString()
                }
            ]

        })
        users.forEach(async user => {
            user.likedPost.filter((c: { _id: { toString: any; }; }) => c._id.toString !== deleted._id.toString())
            user.savedPost.filter((c: { _id: { toString: any; }; }) => c._id.toString !== deleted._id.toString())
            await user.save();
        });
        if (!deleted) return NextResponse.json({ message: 'this post does not exist', status: 'not-success' })
        return NextResponse.json({ message: 'post has been deleted successfully', data: deleted, status: 'success' })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ data: error, status: 'error' })
    }
}


export async function PATCH(req: Request, { params: { id } }: { params: { id: string } }) {
    try {
        await connect();
        const { text, comment, user, type } = await req.json();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        if (type === 'like') {
            if (!userId) return NextResponse.json({ message: "user id is required", status: "not-success" })
            const post = await postSchema.findById(id)
            const user = await userSchema.findById(userId);
            if (user.likedPost.find((c: { _id: { toString: () => any; }; }) => c._id.toString() === post._id.toString()))
                return NextResponse.json({ message: 'post already liked', status: 'not-success' })
            post.likes++;
            user.likedPost.push(post);
            await user.save();
            await post.save();
            return NextResponse.json({ message: 'post liked successfully', status: 'success' })
        }
        if (type === 'unlike') {
            const post = await postSchema.findById(id)
            const user = await userSchema.findById(userId).populate('likedPost');
            const oldLikedPost = user.likedPost
            const newLikedPost = user.likedPost = user.likedPost.filter((c: { _id: any; }) => c._id.toString() !== post._id.toString())
            if (isEqual(oldLikedPost, newLikedPost)) return NextResponse.json({ message: 'post already unliked', status: 'not-success' })
            post.likes--;
            await user.save();
            await post.save();
            return NextResponse.json({ message: 'post unliked successfully', status: 'success' })
        }
        if (!comment || !user) {
            if (text) {
                const data = await postSchema.findByIdAndUpdate(id, {
                    text
                })
                return NextResponse.json({ message: 'post has been updated successfully', data, status: 'success' })
            }
            else return NextResponse.json({ message: 'post has been updated successfully', status: 'success' })
        }
        const commentData = await postSchema.findByIdAndUpdate(id, {
            $push: {
                comments: {
                    text: comment, user
                }
            }
        })
        return NextResponse.json({ message: 'comment has been added successfully',data:commentData, status: 'success' })
    } catch (error) {
        return NextResponse.json({ data: error, status: 'error' })
    }
}