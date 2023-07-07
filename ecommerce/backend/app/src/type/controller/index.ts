interface IRegisterRequest {
  body: {
    username: string;
    password: string;
    role?: "user" | "admin";
  };
}

export type { IRegisterRequest };
