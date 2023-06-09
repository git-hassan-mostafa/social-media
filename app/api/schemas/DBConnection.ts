import mongoose from "mongoose"

export default async function  connect():Promise<void>{
    try {
        await mongoose.connect(process.env.MONGO_URI || '',{
            
        })
        console.log('connected to the data base')
    }
    catch (error) {
        console.log(error)
    }
}