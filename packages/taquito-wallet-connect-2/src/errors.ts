import { PermissionScopeMethods } from './types';

/**
 *  @category Error
 *  @description Error that indicates missing required permission scopes
 */
export class MissingRequiredScope extends Error {
  name = 'MissingRequiredScope';

  constructor(public requiredScopes: PermissionScopeMethods | string) {
    super(`Required permission scope were not granted for: ${requiredScopes}`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates the wallet returned an invalid namespace
 */
 export class InvalidReceivedSessionNamespace extends Error {
  name = 'InvalidReceivedSessionNamespace';

  constructor(message: string, public code: number, public data?: string | string[]) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid session key being passed
 */
export class InvalidSessionKey extends Error {
  name = 'InvalidSessionKey';

  constructor(public key: string) {
    super(`Invalid session key ${key}`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates the pkh is not part of the active account in the session
 */
export class InvalidAccount extends Error {
  name = 'InvalidAccount';

  constructor(public key: string) {
    super(`Invalid pkh ${key}`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates the connection could not be established
 */
export class ConnectionFailed extends Error {
  name = 'ConnectionFailed';

  constructor(public originalError: any) {
    super(`Unable to connect`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates there is no active session
 */
export class NotConnected extends Error {
  name = 'NotConnected';

  constructor() {
    super('Not connected, no active session');
  }
}

/**
 *  @category Error
 *  @description Error that indicates the active account is not specified
 */
export class ActiveAccountUnspecified extends Error {
  name = 'ActiveAccountUnspecified';

  constructor() {
    super('Please specify the active account using the "setActiveAccount" method.');
  }
}
