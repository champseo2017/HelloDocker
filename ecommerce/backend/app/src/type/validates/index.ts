interface IUserReg {
  username?: string;
  password?: string;
  role?: "user" | "admin";
}

interface IUserLogin {
  username?: string;
  password?: string;
}

interface IProductValid {
  name?: string;
  price?: number;
  description?: string;
  quantity?: number;
}

export type { IUserReg, IUserLogin, IProductValid };
