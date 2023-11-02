import { Schema, model } from "mongoose";
import { IUser } from "./user.interface";

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "buyer", "seller"], default: "buyer" },
  date: { type: Date, default: Date.now },
});

const User = model<IUser>("User", UserSchema);
export default User;
