export interface User {
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  role: "user" | "admin";
}
