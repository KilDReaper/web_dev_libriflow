import api from "@/lib/api";

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (data: {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};

export const updateProfile = async (data: any) => {
  const res = await api.put("/auth/profile", data);
  return res.data;
};

export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post("/auth/upload-profile-image", formData);
  return res.data;
};
