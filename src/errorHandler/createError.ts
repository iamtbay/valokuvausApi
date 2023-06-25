interface IError {
  status?: number;
  message: string;
}
export const createError = (status: number, message: string) => {
  const err: IError = new Error();
  err.status = status;
  err.message = message;
  return err;
};
