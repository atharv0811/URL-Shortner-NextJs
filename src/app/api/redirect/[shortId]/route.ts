import dbConnect from "@/lib/dbConnect";
import Url from "@/models/Url";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { shortId: string } }) {
    await dbConnect()

    try {
        const shortId = params.shortId;
        const entry = await Url.findOneAndUpdate(
            {
                shortUrl: shortId
            },
            {
                $inc: {
                    clicks: 1
                }
            },
            { new: true }
        )

        if (!entry) {
            return NextResponse.json(
                {
                    success: false,
                    message: "URL not found"
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                url: entry.url,
            }
        )

    } catch (error) {
        console.log("Error redirecting to URL:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error redirecting to URL"
            },
            { status: 500 }
        );
    }
}