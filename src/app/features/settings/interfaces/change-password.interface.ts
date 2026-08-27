export interface ChangePasswordREQ {
  password: string;
  newPassword: string;
}

export interface ChangePasswordRES {
  success: boolean;
  message: string;
  data: ChangePasswordData;
}

interface ChangePasswordData {
  token: string;
  tokenType: string;
  expiresIn: string;
}
