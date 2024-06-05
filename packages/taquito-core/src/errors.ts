// ==========================================================================================
// parent error classes for Taquito
// ==========================================================================================
/**
 *  @category Error
 *  @description Parent error class all taquito errors to extend from
 */
export class TaquitoError extends Error {}

/**
 *  @category Error
 *  @description Error that indicates invalid user inputs
 */
export class ParameterValidationError extends TaquitoError {}

/**
 *  @category Error
 *  @description Error returned by RPC node
 */
export class RpcError extends TaquitoError {}

/**
 *  @category Error
 *  @description Error that indicates TezosToolKit has not been configured appropriately
 */
export class TezosToolkitConfigError extends TaquitoError {}

/**
 *  @category Error
 *  @description Error that indicates a requested action is not supported by Taquito
 */
export class UnsupportedActionError extends TaquitoError {}

/**
 *  @category Error
 *  @description Error during a network operation
 */
export class NetworkError extends TaquitoError {}

/**
 *  @category Error
 *  @description Error that indicates user attempts an action without necessary permissions
 */
export class PermissionDeniedError extends TaquitoError {}

// ==========================================================================================
// common error classes for Taquito
// ==========================================================================================
/**
 *  @category Error
 *  @description Error that indicates an invalid originated or implicit address being passed or used
 */
export class InvalidAddressError extends ParameterValidationError {
  constructor(
    public readonly address: string,
    public readonly errorDetail?: string
  ) {
    super();
    this.name = 'InvalidAddressError';
    this.message = `Invalid address "${address}"`;
    this.message += errorDetail ? ` ${errorDetail}.` : '.';
  }
}

export class InvalidStakingAddressError extends ParameterValidationError {
  constructor(
    public readonly address: string,
    public readonly errorDetail?: string
  ) {
    super();
    this.name = 'InvalidStakingAddressError';
    this.message = `Invalid staking address "${address}", you can only set destination as your own address`;
  }
}

export class InvalidFinalizeUnstakeAmountError extends ParameterValidationError {
  constructor(
    public readonly address: string,
    public readonly errorDetail?: string
  ) {
    super();
    this.name = 'InvalidFinalizeUnstakeAmountError';
    this.message = `The amount can only be 0 when finalizing an unstake`;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid block hash being passed or used
 */
export class InvalidBlockHashError extends ParameterValidationError {
  constructor(
    public readonly blockHash: string,
    public readonly errorDetail?: string
  ) {
    super();
    this.name = 'InvalidBlockHashError';
    this.message = `Invalid block hash "${blockHash}"`;
    this.message += errorDetail ? ` ${errorDetail}.` : '.';
  }
}

/**
 * @category Error
 * @description Error that indicates an invalid amount of tez being passed as a parameter
 */
export class InvalidAmountError extends ParameterValidationError {
  constructor(public readonly amount: string) {
    super();
    this.name = 'InvalidAmountError';
    this.message = `Invalid amount "${amount}"`;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid derivation path being passed or used
 */
export class InvalidDerivationPathError extends ParameterValidationError {
  constructor(
    public readonly derivationPath: string,
    public readonly errorDetail?: string
  ) {
    super();
    this.name = 'InvalidDerivationPathError';
    this.message = `Invalid derivation path "${derivationPath}"`;
    this.message += errorDetail ? ` ${errorDetail}.` : '.';
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid hex string have been passed or used
 */
export class InvalidHexStringError extends ParameterValidationError {
  constructor(
    public readonly hexString: string,
    public readonly errorDetail?: string
  ) {
    super();
    this.name = 'InvalidHexStringError';
    this.message = `Invalid hex string "${hexString}"`;
    this.message += errorDetail ? ` ${errorDetail}.` : '.';
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid message being passed or used
 */
export class InvalidMessageError extends ParameterValidationError {
  constructor(
    public readonly msg: string,
    public readonly errorDetail?: string
  ) {
    super();
    this.name = 'InvalidMessageError';
    this.message = `Invalid message "${msg}"`;
    this.message += errorDetail ? ` ${errorDetail}.` : '.';
  }
}

/**
 *  @category Error
 *  @description Error that indicates invalid view parameter of a smart contract
 */
export class InvalidViewParameterError extends ParameterValidationError {
  constructor(
    public readonly viewName: string,
    public readonly sigs: any,
    public readonly args: any,
    public readonly cause?: any
  ) {
    super();
    this.name = 'InvalidViewParameterError';
    this.message = `Invalid view arguments ${JSON.stringify(
      args
    )} received for name "${viewName}" expecting one of the following signatures ${JSON.stringify(
      sigs
    )}.`;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid private key being passed or used
 */
export class InvalidKeyError extends ParameterValidationError {
  constructor(public readonly errorDetail?: string) {
    super();
    this.name = 'InvalidKeyError';
    this.message = `Invalid private key`;
    this.message += errorDetail ? ` ${errorDetail}.` : '.';
  }
}

/**
 *  @category Error
 *  @description Error that indicates an Invalid Public Key being passed or used
 */
export class InvalidPublicKeyError extends ParameterValidationError {
  constructor(
    public readonly publicKey: string,
    readonly errorDetail?: string
  ) {
    super();
    this.name = 'InvalidPublicKeyError';
    this.message = `Invalid public key "${publicKey}"`;
    this.message += errorDetail ? ` ${errorDetail}.` : '.';
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid signature being passed or used
 */
export class InvalidSignatureError extends ParameterValidationError {
  constructor(
    public readonly signature: string,
    public readonly errorDetail?: string
  ) {
    super();
    this.name = 'InvalidSignatureError';
    this.message = `Invalid signature "${signature}"`;
    this.message += errorDetail ? ` ${errorDetail}.` : '.';
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid contract address being passed or used
 */
export class InvalidContractAddressError extends ParameterValidationError {
  constructor(
    public readonly contractAddress: string,
    public readonly errorDetail?: string
  ) {
    super();
    this.name = 'InvalidContractAddressError';
    this.message = `Invalid contract address "${contractAddress}"`;
    this.message += errorDetail ? ` ${errorDetail}.` : '.';
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid chain id being passed or used
 */
export class InvalidChainIdError extends ParameterValidationError {
  constructor(
    public readonly chainId: string,
    public readonly errorDetail?: string
  ) {
    super();
    this.name = 'InvalidChainIdError';
    this.message = `Invalid chain id "${chainId}"`;
    this.message += errorDetail ? ` ${errorDetail}.` : '.';
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid public key hash being passed or used
 */
export class InvalidKeyHashError extends ParameterValidationError {
  constructor(
    public readonly keyHash: string,
    public readonly errorDetail?: string
  ) {
    super();
    this.name = 'InvalidKeyHashError';
    this.message = `Invalid public key hash "${keyHash}"`;
    this.message += errorDetail ? ` ${errorDetail}.` : '.';
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid operation hash being passed or used
 */
export class InvalidOperationHashError extends ParameterValidationError {
  constructor(
    public readonly operationHash: string,
    public readonly errorDetail?: string
  ) {
    super();
    this.name = 'InvalidOperationHashError';
    this.message = `Invalid operation hash "${operationHash}"`;
    this.message += errorDetail ? ` ${errorDetail}.` : '.';
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid operation kind being passed or used
 */
export class InvalidOperationKindError extends ParameterValidationError {
  constructor(
    public readonly operationKind: string,
    public readonly errorDetail?: string
  ) {
    super();
    this.name = 'InvalidOperationKindError';
    this.message = `Invalid operation kind "${operationKind}"`;
    this.message += errorDetail ? ` ${errorDetail}.` : '.';
  }
}

/**
 *  @category Error
 *  @description General error that indicates something is no longer supported and/or deprecated
 */
export class DeprecationError extends UnsupportedActionError {
  constructor(public readonly message: string) {
    super();
    this.name = 'DeprecationError';
  }
}

/**
 *  @category Error
 *  @description General error that indicates an action is prohibited or not allowed
 */
export class ProhibitedActionError extends UnsupportedActionError {
  constructor(public readonly message: string) {
    super();
    this.name = 'ProhibitedActionError';
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure in grabbing the public key
 */
export class PublicKeyNotFoundError extends TaquitoError {
  constructor(
    public readonly pkh: string,
    public readonly cause?: any
  ) {
    super();
    this.name = 'PublicKeyNotFoundError';
    this.message = `Public key not found of this address "${pkh}" in either wallet or contract API.`;
  }
}
