import { NextResponse } from 'next/server';
import connect from '../schemas/DBConnection';
import postSchema from '../schemas/postSchema';
import { parseInt } from 'lodash';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '10';
        const skip: number = (parseInt(page, 10) - 1) * (parseInt(limit, 10) ?? 0);
        console.log(userId)
        await connect();
        // const conditions: any = userId && { 'user._id': userId.toString() }
        const conditions =
         userId ? { 'user': userId.toString() }:
          {}
        const posts = await postSchema.find(conditions).sort({ createdAt: -1 }).populate('comments.user')
        .populate('user')
        .skip(skip).limit(parseInt(limit ?? '0', 10)).exec();
        return NextResponse.json({ data: posts, status: 'success', length: posts.length });
    } catch (error) {
        console.log('error', error)
        return NextResponse.json({ data: error, status: 'error', length: 0 })
    }

}

export async function POST(req: Request) {
    try {
        await connect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const { text, photo, photoPath } = await req.json()
        console.log(text)
        console.log(photo)
        if ((!text && !photo) || !userId) return NextResponse.json({ message: 'a text is required', status: 'not-success' })
        const newPost = new postSchema({
            text, photo, user: userId, photoPath
        })
        await newPost.save()

        return NextResponse.json({ message: 'post uploaded successfully', status: 'success' })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ data: error, status: 'error' })
    }
}