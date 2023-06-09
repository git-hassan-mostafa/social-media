import { NextResponse } from 'next/server';
import connect from '../schemas/DBConnection';
import userSchema from '../schemas/userSchema';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '10';
        const skip: number = (parseInt(page, 10) - 1) * (parseInt(limit, 10) ?? 0);
        await connect();
        const users = await userSchema.find({}).skip(skip).limit(parseInt(limit ?? '0', 10)).exec()
        return NextResponse.json({ data: users, status: 'success', length: users.length })

    } catch (error) {
        console.log('error', error)
        return NextResponse.json({ data: error, status: 'error', length: 0 })
    }

}

export async function POST(req: Request) {
    try {
        await connect();
        const { email, photo, name } = await req.json()
        if (!email || !name) return NextResponse.json({ message: 'email and name are provided', status: 'not-success' })
        const newUser = new userSchema({
            email, name, photo
        })
        await newUser.save()

        return NextResponse.json({ data: newUser, status: 'success' })
    } catch (error) {
        console.log(error)
    }
}