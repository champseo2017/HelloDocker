interface IUserReg {
  username?: string;
  password?: string;
  role?: "user" | "admin";
}

interface IUserLogin {
  username?: string;
  password?: string;
}

export type { IUserReg, IUserLogin };
