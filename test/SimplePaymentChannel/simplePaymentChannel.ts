import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, network } from "hardhat";

import type { Signers } from "../types";
import { deployLockFixture } from "./simplePaymentChannel.fixture";

describe("SimplePaymentChannel", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers = await ethers.getSigners();
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe("DAO", function () {
    beforeEach(async function () {
      const { simplePaymentChannel, simplePaymentChannel_address, owner, address1 } =
        await this.loadFixture(deployLockFixture);

      this.simplePaymentChannel = simplePaymentChannel;
      this.simplePaymentChannel_address = simplePaymentChannel_address;
      this.owner = owner;
      this.address1 = address1;
    });

     it("deposit", async function () {
        expect(await this.simplePaymentChannel.connect(this.owner).deposit({value: 100})).not.to.be.reverted;
     });

     it("listPayments", async function () {
        await this.simplePaymentChannel.connect(this.owner).deposit({value: 100});
        await this.simplePaymentChannel.connect(this.owner).listPayment(50);
        await this.simplePaymentChannel.connect(this.owner).deposit({value: 100});
        await this.simplePaymentChannel.connect(this.owner).listPayment(50); 

        const balance = await this.simplePaymentChannel.connect(this.owner).checkBalance();
        expect(balance).equals(100);
     });

     it("getAllPayments", async function () {
        await this.simplePaymentChannel.connect(this.owner).deposit({value: 100});
        await this.simplePaymentChannel.connect(this.owner).listPayment(50);
        await this.simplePaymentChannel.connect(this.owner).deposit({value: 100});
        await this.simplePaymentChannel.connect(this.owner).listPayment(50); 

        const getAllPayments = await this.simplePaymentChannel.connect(this.owner).getAllPayments();
        expect(getAllPayments.length).equals(2);
     });

     it("closeChannel", async function () {
        await this.simplePaymentChannel.connect(this.owner).deposit({value: 100});
        await this.simplePaymentChannel.connect(this.owner).listPayment(10); 
        await this.simplePaymentChannel.connect(this.owner).listPayment(10); 
        await this.simplePaymentChannel.connect(this.owner).listPayment(10); 
        await this.simplePaymentChannel.connect(this.owner).listPayment(10); 
        await this.simplePaymentChannel.connect(this.owner).listPayment(10); 

        const balanceContractBef = await ethers.provider.getBalance(this.simplePaymentChannel_address);

        const balanceRecipientBef = await ethers.provider.getBalance(this.owner);

        await this.simplePaymentChannel.connect(this.owner).closeChannel();

        const balanceContractAfter = await ethers.provider.getBalance(this.simplePaymentChannel_address);

        const balanceRecipientAf = await ethers.provider.getBalance(this.address1);

        expect(balanceContractBef).to.greaterThan(balanceContractAfter);
        expect(balanceRecipientBef).to.lessThan(balanceRecipientAf);

     })
  });
});
