declare global {
  namespace Express {
    export interface Request {
      user?: IReqUser;
    }
  }
}

export interface IReqUser {
  username: string;
  userId: string;
  email: string;
}

export interface IAuthUser {
  currentUId: string;
}
