import { Schema, model } from "mongoose";

interface IUser {
  name: string;
  image?: string;
  email: string;
  password: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum ROLE {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    image: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ROLE, default: ROLE.USER },
  },
  { timestamps: true },
);

const User = model<IUser>("User", UserSchema);
export default User;
