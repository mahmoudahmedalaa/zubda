export type ApiErrorCode =
  | "NOT_IMPLEMENTED"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "CONFIGURATION_ERROR"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR";

export function jsonError(
  code: ApiErrorCode,
  message: string,
  status: number
): Response {
  return Response.json(
    {
      error: {
        code,
        message
      }
    },
    { status }
  );
}

export function jsonOk<TData>(data: TData): Response {
  return Response.json(data);
}
