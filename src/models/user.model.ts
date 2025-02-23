import { Schema, model } from "mongoose";

export interface IUser {
  name: string;
  image?: string;
  email: string;
  password: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum USER_ROLE {
  BUYER = "buyer",
  SELLER = "seller",
  ADMIN = "admin",
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    image: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: USER_ROLE, default: USER_ROLE.BUYER },
  },
  { timestamps: true },
);

const User = model<IUser>("User", UserSchema);

export default User;
