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
  id?: string;
  positionImage?: { position: number }[];
}

export type { IUserReg, IUserLogin, IProductValid };
