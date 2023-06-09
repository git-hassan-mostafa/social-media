import { NextResponse } from 'next/server';
import connect from '../../../schemas/DBConnection';
import postSchema from '../../../schemas/postSchema';

export async function PATCH(req: Request, { params: { id, commentId } }: { params: { id: string, commentId: string } }) {
    try {
        await connect();
        const { comment } = await req.json();
        if(!comment) return NextResponse.json({message:'please provide a text',status:'not-success'})
        const post = await postSchema.findById(id)
        if (!post) return NextResponse.json({ message: 'this post does not exist', status: 'not-success' })
        const updatedComment = post?.comments?.find((c: { _id: { toString: () => string; }; }) => c._id.toString() === commentId);
        if (!updatedComment) return NextResponse.json({ message: 'this comment does not exist', status: 'not-success' })
        updatedComment.text = comment
        await post.save()
        return NextResponse.json({ message: 'comment updated successfully', status: 'success' })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ data: error, status: 'error' })
    }
}

export async function DELETE(req: Request, { params: { id, commentId } }: { params: { id: string, commentId: string } }) {
    try {
        await connect();
        const post = await postSchema.findById(id)
        if (!post) return NextResponse.json({ message: 'this post does not exist', status: 'not-success' })
        const comment = post.comments.find((c: { _id: string; }) => c._id.toString() === commentId)
        if (!comment) return NextResponse.json({ message: 'this comment does not exist', status: 'not-success' })
        const comments = post?.comments?.filter((c: { _id: { toString: () => string; }; }) => c._id.toString() !== commentId)
        post.comments = comments
        await post.save()
        return NextResponse.json({ message: 'comment deleted successfully', status: 'success' })
    } catch (error) {
        return NextResponse.json({ data: error, status: 'error' })
    }


}