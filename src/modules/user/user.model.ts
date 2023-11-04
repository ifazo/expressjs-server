import { Schema, model } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
  date: Date;
}

export enum ROLE {
  ADMIN = "admin",
  BUYER = "buyer",
  SELLER = "seller",
}

const UserSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ROLE, default: ROLE.BUYER },
  date: { type: Date, default: Date.now },
});

const User = model<IUser>("User", UserSchema);
export default User;
