export const web3SendToPromiEvent = (promievent, eventEmitter) => {
  return promievent
    .on('transactionHash', function (hash) {
      eventEmitter.emit('transactionHash', hash);
    })
    .on('confirmation', function (confirmationNumber, receipt) {
      eventEmitter.emit('confirmation', confirmationNumber, receipt);
    })
    .on('receipt', function (receipt) {
      eventEmitter.emit('receipt', receipt);
    })
    .on('error', (error) => eventEmitter.emit('error', error))
};
