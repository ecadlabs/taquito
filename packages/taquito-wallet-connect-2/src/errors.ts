import { PermissionScopeMethods } from './types';

/**
 *  @category Error
 *  @description Error that indicates missing required permission scopes
 */
export class MissingRequiredScope extends Error {
  name = 'MissingRequiredScope';

  constructor(public requiredScopes: PermissionScopeMethods | string) {
    super(`Required permission scope were not granted for "${requiredScopes}"`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates the wallet returned an invalid namespace
 */
export class InvalidReceivedSessionNamespace extends Error {
  name = 'InvalidReceivedSessionNamespace';

  constructor(
    public messageWc: string,
    public codeWc: number,
    type: 'invalid' | 'incomplete',
    public data?: string | string[]
  ) {
    super();
    const baseMessage = `${codeWc}: ${messageWc}.`;
    this.message = data
      ? type === 'incomplete'
        ? ` ${baseMessage} "${data}" is missing in the session namespace.`
        : ` ${baseMessage} "${data}" is invalid.`
      : baseMessage;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid session key being passed
 */
export class InvalidSessionKey extends Error {
  name = 'InvalidSessionKey';

  constructor(public key: string) {
    super(`Invalid session key "${key}"`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates the pkh is not part of the active accounts in the session
 */
export class InvalidAccount extends Error {
  name = 'InvalidAccount';

  constructor(public pkh: string) {
    super(`Invalid pkh "${pkh}"`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates the network is not part of the active networks in the session
 */
export class InvalidNetwork extends Error {
  name = 'InvalidNetwork';

  constructor(public network: string) {
    super(`Invalid network "${network}"`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates the combinaison pkh-network is not part of the active session
 */
export class InvalidNetworkOrAccount extends Error {
  name = 'InvalidNetworkOrAccount';

  constructor(
    public network: string,
    public pkh: string
  ) {
    super(
      `No permission. The combinaison "${network}" and "${pkh}" is not part of the active session.`
    );
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

/**
 *  @category Error
 *  @description Error that indicates the active network is not specified
 */
export class ActiveNetworkUnspecified extends Error {
  name = 'ActiveNetworkUnspecified';

  constructor() {
    super('Please specify the active network using the "setActiveNetwork" method.');
  }
}

/**
 *  @category Error
 *  @description Error that indicates the session is invalid
 */
export class InvalidSession extends Error {
  name = 'InvalidSession';

  constructor(message: string) {
    super(message);
  }
}

export class PublicKeyRetrievalError extends Error {
  name = 'PublicKeyRetrievalError';

  constructor() {
    super(`Unable to retrieve public key`);
  }
}
