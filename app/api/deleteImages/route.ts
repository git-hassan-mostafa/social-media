import { NextResponse } from "next/server";
import connect from "../schemas/DBConnection";
import DeleteSchema from '../schemas/deleteImage';
export async function POST(req: Request) {
    try {
        await connect();
        const { imagePath } = await req.json()
        if (!imagePath) return NextResponse.json({ message: 'required', status: 'not-success' })
        const newPost = new DeleteSchema({
            imagePath
        })
        await newPost.save()

        return NextResponse.json({ message: 'added', status: 'success' })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ data: error, status: 'error' })
    }
}