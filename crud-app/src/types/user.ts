export type User = {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type CreateUserInput = {
  username: string;
  email: string;
};

export type UpdateUserInput = {
  username?: string;
  email?: string;
};
