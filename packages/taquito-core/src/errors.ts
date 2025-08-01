// ==========================================================================================
// parent error classes for Taquito
// ==========================================================================================

export enum ValidationResult {
  VALID,
  NO_PREFIX_MATCHED,
  INVALID_CHECKSUM,
  INVALID_LENGTH,
  INVALID_ENCODING,
  OTHER,
}

/**
 *  @category Error
 *  @description Parent error class all taquito errors to extend from
 */
export class TaquitoError extends Error { }

const resultDesc: { [key in ValidationResult]?: string } = {
  [ValidationResult.NO_PREFIX_MATCHED]: 'unsupported Base58 prefix',
  [ValidationResult.INVALID_CHECKSUM]: 'invalid checksum',
  [ValidationResult.INVALID_LENGTH]: 'invalid length',
  [ValidationResult.INVALID_ENCODING]: 'invalid Base58 encoding',
};

/**
 *  @category Error
 *  @description Error that indicates invalid user inputs
 */
export class ParameterValidationError extends TaquitoError {
  public readonly errorDetail?: string;
  public readonly result?: ValidationResult;

  constructor(validationResult?: ValidationResult);
  constructor(message?: string, errorDetail?: string | ValidationResult);
  constructor(message?: string, validationResult?: ValidationResult, errorDetail?: string);
  constructor(message?: string | ValidationResult, validationResult?: string | ValidationResult, errorDetail?: string) {
    let detail: string | undefined;
    let result: ValidationResult | undefined;
    let msg: string | undefined;

    if (message !== undefined) {
      if (typeof message === 'string') {
        msg = message;
        if (validationResult !== undefined) {
          if (typeof validationResult === 'string') {
            detail = validationResult;
          } else {
            result = validationResult;
            if (errorDetail !== undefined) {
              detail = errorDetail
            } else {
              detail = resultDesc[validationResult];
            }
          }
        }
      } else {
        result = message;
        detail = resultDesc[message];
        msg = detail;
      }
    }

    super(msg);
    this.name = this.constructor.name;
    this.result = result;
    this.errorDetail = detail;
  }
}

/**
 *  @category Error
 *  @description Error returned by RPC node
 */
export class RpcError extends TaquitoError { }

/**
 *  @category Error
 *  @description Error that indicates TezosToolKit has not been configured appropriately
 */
export class TezosToolkitConfigError extends TaquitoError { }

/**
 *  @category Error
 *  @description Error that indicates a requested action is not supported by Taquito
 */
export class UnsupportedActionError extends TaquitoError { }

/**
 *  @category Error
 *  @description Error during a network operation
 */
export class NetworkError extends TaquitoError { }

/**
 *  @category Error
 *  @description Error that indicates user attempts an action without necessary permissions
 */
export class PermissionDeniedError extends TaquitoError { }

// ==========================================================================================
// common error classes for Taquito
// ==========================================================================================
/**
 *  @category Error
 *  @description Error that indicates an invalid originated or implicit address being passed or used
 */
export class InvalidAddressError extends ParameterValidationError {
  constructor(public readonly address: string, errorDetail?: string | ValidationResult) {
    super(`Invalid address "${address}"`, errorDetail);
    this.name = this.constructor.name;
  }
}

export class InvalidStakingAddressError extends ParameterValidationError {
  constructor(public readonly address: string, errorDetail?: string | ValidationResult) {
    super(`Invalid staking address "${address}", you can only set destination as your own address`, errorDetail);
    this.name = this.constructor.name;
  }
}

export class InvalidFinalizeUnstakeAmountError extends ParameterValidationError {
  constructor(public readonly address: string, errorDetail?: string | ValidationResult) {
    super(`The amount can only be 0 when finalizing an unstake`, errorDetail);
    this.name = this.constructor.name;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid block hash being passed or used
 */
export class InvalidBlockHashError extends ParameterValidationError {
  constructor(public readonly blockHash: string, errorDetail?: string | ValidationResult) {
    super(`Invalid block hash "${blockHash}"`, errorDetail);
    this.name = this.constructor.name;
  }
}

/**
 * @category Error
 * @description Error that indicates an invalid amount of tez being passed as a parameter
 */
export class InvalidAmountError extends ParameterValidationError {
  constructor(public readonly amount: string, errorDetail?: string | ValidationResult) {
    super(`Invalid amount "${amount}"`, errorDetail);
    this.name = this.constructor.name;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid derivation path being passed or used
 */
export class InvalidDerivationPathError extends ParameterValidationError {
  constructor(public readonly derivationPath: string, errorDetail?: string | ValidationResult) {
    super(`Invalid derivation path "${derivationPath}"`, errorDetail);
    this.name = this.constructor.name;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid hex string have been passed or used
 */
export class InvalidHexStringError extends ParameterValidationError {
  constructor(public readonly hexString: string, errorDetail?: string | ValidationResult) {
    super(`Invalid hex string "${hexString}"`, errorDetail);
    this.name = this.constructor.name;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid message being passed or used
 */
export class InvalidMessageError extends ParameterValidationError {
  constructor(public readonly msg: string, errorDetail?: string | ValidationResult) {
    super(`Invalid message "${msg}"`, errorDetail);
    this.name = this.constructor.name;
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
    public readonly cause?: any,
    errorDetail?: string
  ) {
    const message = `Invalid view arguments ${JSON.stringify(
      args
    )
      } received for name "${viewName}" expecting one of the following signatures ${JSON.stringify(
        sigs
      )
      }.`;
    super(message, errorDetail);
    this.name = this.constructor.name;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid private key being passed or used
 */
export class InvalidKeyError extends ParameterValidationError {
  constructor(errorDetail?: string | ValidationResult) {
    super(`Invalid private key`, errorDetail);
    this.name = this.constructor.name;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an Invalid Public Key being passed or used
 */
export class InvalidPublicKeyError extends ParameterValidationError {
  constructor(
    public readonly publicKey: string,
    errorDetail?: string | ValidationResult
  ) {
    super(`Invalid public key "${publicKey}"`, errorDetail);
    this.name = this.constructor.name;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid signature being passed or used
 */
export class InvalidSignatureError extends ParameterValidationError {
  constructor(
    public readonly signature: string,
    errorDetail?: string | ValidationResult
  ) {
    super(`Invalid signature "${signature}"`, errorDetail);
    this.name = this.constructor.name;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid contract address being passed or used
 */
export class InvalidContractAddressError extends ParameterValidationError {
  constructor(
    public readonly contractAddress: string,
    errorDetail?: string | ValidationResult
  ) {
    super(`Invalid contract address "${contractAddress}"`, errorDetail);
    this.name = this.constructor.name;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid chain id being passed or used
 */
export class InvalidChainIdError extends ParameterValidationError {
  constructor(
    public readonly chainId: string,
    errorDetail?: string | ValidationResult
  ) {
    super(`Invalid chain id "${chainId}"`, errorDetail);
    this.name = this.constructor.name;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid public key hash being passed or used
 */
export class InvalidKeyHashError extends ParameterValidationError {
  constructor(
    public readonly keyHash: string,
    errorDetail?: string | ValidationResult
  ) {
    super(`Invalid public key hash "${keyHash}"`, errorDetail);
    this.name = this.constructor.name;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid operation hash being passed or used
 */
export class InvalidOperationHashError extends ParameterValidationError {
  constructor(
    public readonly operationHash: string,
    errorDetail?: string | ValidationResult
  ) {
    super(`Invalid operation hash "${operationHash}"`, errorDetail);
    this.name = this.constructor.name;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid operation kind being passed or used
 */
export class InvalidOperationKindError extends ParameterValidationError {
  constructor(
    public readonly operationKind: string,
    errorDetail?: string | ValidationResult
  ) {
    super(`Invalid operation kind "${operationKind}"`, errorDetail);
    this.name = this.constructor.name;
  }
}

/**
 *  @category Error
 *  @description General error that indicates something is no longer supported and/or deprecated
 */
export class DeprecationError extends UnsupportedActionError {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 *  @category Error
 *  @description General error that indicates an action is prohibited or not allowed
 */
export class ProhibitedActionError extends UnsupportedActionError {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
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
    super(`Public key not found of this address "${pkh}" in either wallet or contract API.`);
    this.name = this.constructor.name;
  }
}

