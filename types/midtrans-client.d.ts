declare module 'midtrans-client' {
  export class Snap {
    constructor(options: { isProduction: boolean; serverKey: string; clientKey: string });
    createTransaction(parameter: object): Promise<{ token: string; redirect_url: string }>;
    createTransactionToken(parameter: object): Promise<string>;
    createTransactionRedirectUrl(parameter: object): Promise<string>;
  }

  export class CoreApi {
    constructor(options: { isProduction: boolean; serverKey: string; clientKey: string });
    charge(parameter: object): Promise<any>;
    capture(transactionId: string): Promise<any>;
    refund(transactionId: string, parameter?: object): Promise<any>;
    transaction: {
      status(transactionId: string): Promise<any>;
      cancel(transactionId: string): Promise<any>;
      notification(body: object): Promise<any>;
      refund(transactionId: string, parameter?: object): Promise<any>;
      expire(transactionId: string): Promise<any>;
    };
  }
}