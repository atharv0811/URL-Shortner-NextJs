import dbConnect from "@/lib/dbConnect";
import Url from "@/models/Url";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { shortId: string } }) {
    await dbConnect();

    try {
        const { shortId } = params;
        console.log(shortId)
        const deletedUrl = await Url.findOneAndDelete({ shortUrl: shortId });

        if (!deletedUrl) {
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
                message: "URL deleted successfully"
            }
        );

    } catch (error) {
        console.log("Error deleting url:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error deleting url"
            },
            { status: 500 }
        );
    }
}
