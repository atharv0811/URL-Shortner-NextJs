import dbConnect from "@/lib/dbConnect";
import Url from "@/models/Url";
import User from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import { nanoid } from "nanoid";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";

interface RequestBody {
    name: string;
    url: string;
    alias?: string;
}

async function generateUniqueShortId(): Promise<string> {
    let isUnique = false;
    let shortId = '';

    while (!isUnique) {
        shortId = nanoid(8);
        const existingUrl = await Url.findOne({ shortUrl: shortId });
        if (!existingUrl) {
            isUnique = true;
        }
    }

    return shortId;
}

export async function POST(req: NextRequest) {
    await dbConnect();

    const token = await getToken({ req });

    if (!token) {
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized"
            },
            {
                status: 401
            }
        );
    }

    try {
        const { name, url, alias }: RequestBody = await req.json();

        if (!url) {
            return NextResponse.json(
                {
                    success: false,
                    message: "URL is required"
                },
                {
                    status: 400
                }
            );
        }

        const userId = token.sub;
        const userData = await User.findById(userId);

        if (!userData) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User not found'
                },
                {
                    status: 404
                }
            );
        }

        let shortId;
        if (alias) {
            const existingUrl = await Url.findOne({ shortUrl: alias });
            if (existingUrl) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Alias already in use'
                    },
                    {
                        status: 400
                    }
                );
            }
            shortId = alias;
        } else {
            shortId = await generateUniqueShortId();
        }

        const newUrl = new Url({
            name,
            url,
            shortUrl: shortId,
            clicks: 0,
            user: userData._id,
        });

        await newUrl.save();

        userData.urls.push(newUrl._id as mongoose.Types.ObjectId);
        await userData.save();

        return NextResponse.json(
            {
                success: true,
                message: "URL is shortened",
                shortUrl: shortId,
                name
            },
            {
                status: 200
            }
        );

    } catch (error) {
        console.log("Error shortening url", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error shortening url"
            },
            {
                status: 500
            }
        );
    }
}
