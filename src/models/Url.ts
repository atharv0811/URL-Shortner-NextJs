import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUrl extends Document {
    name: string;
    url: string;
    shortUrl: string;
    clicks: number;
    user: mongoose.Types.ObjectId;
}

const urlSchema: Schema<IUrl> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        shortUrl: {
            type: String,
            required: true,
            unique: true,
        },
        clicks: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

const Url: Model<IUrl> = mongoose.models.Url || mongoose.model<IUrl>("Url", urlSchema);

export default Url;