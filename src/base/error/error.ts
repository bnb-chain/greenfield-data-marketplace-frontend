export const ErrorMsgMap: Record<string, string> = {
  '4001': 'User rejected the request.',
  '4100':
    'The requested account and/or method has not been authorized by the user.',
  '4200': 'The requested method is not supported by this Network provider.',
  '4900':
    'Your wallet is disconnected. Please check your network connectivity status.',
  '4901':
    'You are not connected to the correct chain for this transaction. Switch your network and retry.',
  '-32700':
    'Your request object is incomplete. Please make sure the object sent to the contract does contain all the data that it requires.',
};
