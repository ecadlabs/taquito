export class RevealEstimateError extends Error {
  name = 'Reveal Estimate Error';
  constructor() {
    super('Unable to estimate the reveal operation, the public key is unknown');
  }
}
