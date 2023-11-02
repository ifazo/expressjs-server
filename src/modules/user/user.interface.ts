export enum ROLE {
  ADMIN = "admin",
  BUYER = "buyer",
  SELLER = "seller",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: ROLE;
  date: Date;
}
