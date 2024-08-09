import dbConnect from "@/lib/dbConnect";
import Url from "@/models/Url";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const token = await getToken({ req });

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authenticated",
                },
                {
                    status: 401,
                }
            );
        }

        const userId = token._id;

        const urls = await Url.find({ user: userId });

        return NextResponse.json(
            {
                success: true,
                message: "URLs fetched",
                urls,
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.log("Error fetching URLs:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error fetching URLs",
            },
            {
                status: 500,
            }
        );
    }
}
