import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from 'bcryptjs'
import { NextResponse } from "next/server";

interface SignupRequestBody {
    username: string;
    email: string;
    password: string;
}

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { username, email, password }: SignupRequestBody = await req.json();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email already exists",
                },
                {
                    status: 400,
                }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            urls: [],
        })

        await newUser.save()

        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully"
            },
            {
                status: 201
            }
        )

    } catch (error) {
        console.log("Error signing up user:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error signing up user"
            },
            {
                status: 500
            }
        );
    }
}