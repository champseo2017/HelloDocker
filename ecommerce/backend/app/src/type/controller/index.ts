interface IRegisterRequest {
  body: {
    username: string;
    password: string;
    role?: "user" | "admin";
  };
}

interface ILoginRequest {
  body: {
    username?: string;
    password?: string;
  }
}

export type { IRegisterRequest, ILoginRequest };
