import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    urls: mongoose.Types.ObjectId[];
}

const userSchema: Schema<IUser> = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        urls: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Url',
            },
        ],
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
