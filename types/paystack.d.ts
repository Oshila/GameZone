declare module '@paystack/inline-js' {
  export default class PaystackPop {
    newTransaction(options: {
      key: string;
      email: string;
      amount: number;
      onSuccess: (transaction: any) => void;
      onCancel?: () => void;
    }): void;
  }
}
