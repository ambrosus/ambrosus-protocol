export class Web3NotFoundError extends Error {
  constructor(...params) {
    super(...params);
    Error.captureStackTrace(this, Web3NotFoundError);
  }

}

export class NotImplementedError extends Error {
  constructor(...params) {
    super(...params);
    Error.captureStackTrace(this, NotImplementedError);
  }
}

export class EthereumError extends Error {
  constructor(...params) {
    super(...params);
    Error.captureStackTrace(this, EthereumError);
  }
}