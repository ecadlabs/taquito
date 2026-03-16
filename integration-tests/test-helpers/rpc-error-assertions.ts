import { HttpResponseError } from '@taquito/http-utils';

const infrastructureRpcErrorPattern =
  /service unavailable|no server is available|index\.closed|bad gateway|gateway timeout|upstream connect/i;

export const isInfrastructureRpcError = (
  error: unknown
): error is HttpResponseError => {
  if (!(error instanceof HttpResponseError)) {
    return false;
  }

  const serializedBody =
    typeof error.body === 'string' ? error.body : JSON.stringify(error.body);
  const details = `${error.message}\n${error.statusText}\n${serializedBody}`;

  return (
    error.status === 502 ||
    error.status === 503 ||
    error.status === 504 ||
    infrastructureRpcErrorPattern.test(details)
  );
};

export const rethrowInfrastructureRpcError = (error: unknown) => {
  if (isInfrastructureRpcError(error)) {
    throw error;
  }
};
