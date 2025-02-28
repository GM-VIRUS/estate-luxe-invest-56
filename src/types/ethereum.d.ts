
interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: Array<any> }) => Promise<any>;
    on: (eventName: string, callback: (...args: any[]) => void) => void;
    removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
    selectedAddress: string | undefined;
    chainId: string | undefined;
  };
}

// Extend the Web3 namespace for TypeScript 
declare namespace Web3 {
  const givenProvider: any;
}
