import { InvalidAddressError, NetworkError, ValidationResult } from '@taquito/core';
import { HttpResponseError } from '@taquito/http-utils';

const invalid = new InvalidAddressError('invalid');
const error = new HttpResponseError('missing', 404, 'Not Found', '{}', '/missing');
if (invalid.message !== 'Invalid address "invalid"' || ValidationResult.INVALID_CHECKSUM !== 1) {
  throw new Error('Core browser behavior changed');
}
if (!(error instanceof NetworkError) || error.status !== 404 || error.body !== '{}') {
  throw new Error('HTTP browser error behavior changed');
}
globalThis.consumerPassed = true;
