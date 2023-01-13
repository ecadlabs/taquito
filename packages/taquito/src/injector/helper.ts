import { HttpResponseError } from '@taquito/core';

export function formatErrorMessage(error: HttpResponseError, stringToReplace: string) {
  const body = JSON.parse(error.body);
  if (body[0] && body[0].kind && body[0].msg) {
    const newBody = JSON.stringify({
      kind: body[0].kind,
      id: body[0].id,
      msg: body[0].msg.replace(stringToReplace, ''),
    });
    return new HttpResponseError(
      `Http error response: (${error.status}) ${newBody}`,
      error.status,
      error.statusText,
      newBody,
      error.url
    );
  } else {
    return error;
  }
}
