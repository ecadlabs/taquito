import { HttpResponseError } from '@taquito/http-utils';
import stringify from 'json-stringify-safe';

export function formatErrorMessage(error: HttpResponseError, stringToReplace: string) {
  const body = JSON.parse(error.body);
  if (body[0] && body[0].kind && body[0].msg) {
    const newBody = stringify({
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
