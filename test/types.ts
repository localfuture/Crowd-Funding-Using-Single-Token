import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";

import type { SimplePaymentChannel } from "../types/SimplePaymentChannel";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    simplePaymentChannel: SimplePaymentChannel
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
}
