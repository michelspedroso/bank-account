export interface IUserLocalBody {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IUserJwt {
  sub: string;
  username: string;
}