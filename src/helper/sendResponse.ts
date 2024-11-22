const sendResponse = (
  res: any,
  statusCode: number,
  success: boolean,
  message: string,
  data: any = null,
  errorMessages: any = null,
) => {
  res.status(statusCode).send({
    success,
    message,
    data,
    errorMessages,
  });
};

export default sendResponse;
