export const REG_EXP = {
  username: /^[a-z0-9_-]{3,30}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/,
};
