import { InvalidAddressError, NetworkError, ValidationResult } from '@taquito/core';
import { HttpBackend, HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import type { ClassifiedTransportError } from '@taquito/http-utils';

const result: ValidationResult = ValidationResult.INVALID_CHECKSUM;
const invalid = new InvalidAddressError('invalid', result);
const address: string = invalid.address;
const error: NetworkError = new HttpResponseError(
  'missing',
  STATUS_CODE.NOT_FOUND,
  'Not Found',
  '{}',
  '/missing'
);
const request: Promise<{ level: number }> = new HttpBackend().createRequest<{ level: number }>({
  url: '/head',
});
const classified: ClassifiedTransportError | undefined = undefined;
// These checks must fail if the installed declarations collapse to any.
// @ts-expect-error URLs are strings.
new HttpBackend().createRequest({ url: 123 });
// @ts-expect-error The public address property remains a string.
const invalidAddress: number = invalid.address;
void [address, error, request, classified, invalidAddress];
