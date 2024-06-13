import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, network } from "hardhat";

import type { Signers } from "../types";
import { deployLockFixture } from "./crowdFunding.fixture";

describe("CrowdFunding", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers = await ethers.getSigners();
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe("DAO", function () {
    beforeEach(async function () {
      const {
        myToken,
        myToken_address,
        crowdFunding,
        crowdFunding_address,
        owner,
        address1,
        address2
      } = await this.loadFixture(deployLockFixture);

      this.myToken = myToken;
      this.myToken_address = myToken_address;
      this.crowdFunding = crowdFunding;
      this.crowdFunding_address = crowdFunding_address;
      this.owner = owner;
      this.address1 = address1;
      this.address2 = address2;
    });

    it("should be able to createCampaign", async function () {
      await this.crowdFunding.connect(this.address1).createCampaign(1000, 10000);

      await network.provider.send("evm_increaseTime", [2000]);
      await network.provider.send("evm_mine");

      const campaign = await this.crowdFunding.getCampaign(1);
      expect(campaign[0]).to.equal(8000);
    });

    it("should be able to contribute", async function () {
      await this.crowdFunding.connect(this.address1).createCampaign(1000, 10000);
      await this.crowdFunding.connect(this.address2).contribute(1, 1000);

      await network.provider.send("evm_increaseTime", [5000]);
      await network.provider.send("evm_mine");

      const campaign = await this.crowdFunding.getCampaign(1);
      expect(campaign[0]).to.equal(4999);
    });

    it("should be able to cancelContribution", async function () {
      await this.crowdFunding.connect(this.address1).createCampaign(1000, 10000);
      await this.crowdFunding.connect(this.address2).createCampaign(2000, 15000);

      await this.crowdFunding.connect(this.address1).contribute(2, 100);
      await this.crowdFunding.connect(this.address2).contribute(1, 500);

      await this.myToken.connect(this.address1).balanceOf(this.address1.address).then((balance: any) => {
        expect(balance).to.equal(99900);
      });

      await this.myToken.connect(this.address2).balanceOf(this.address2.address).then((balance: any) => {
        expect(balance).to.equal(99500);
      });

      await this.crowdFunding.connect(this.address1).cancelContribution(2);
      await this.crowdFunding.connect(this.address1).getContribution(2, this.address1.address).then((contribution: any) => {
        expect(contribution).to.equal(0);
      });

      await this.myToken.connect(this.address1).balanceOf(this.address1.address).then((balance: any) => {
        expect(balance).to.equal(100000);
      });
    });

    it("should be able to withdrawFunds", async function () {
      await this.crowdFunding.connect(this.address1).createCampaign(1000,10000);
      await this.crowdFunding.connect(this.address1).createCampaign(5000,70000);

      await this.crowdFunding.connect(this.address2).contribute(1, 100);
      await this.crowdFunding.connect(this.address2).contribute(1, 50);
      await this.crowdFunding.connect(this.address2).contribute(2, 300);
      await this.crowdFunding.connect(this.address2).contribute(1, 1000);

      await network.provider.send("evm_increaseTime", [9994]);
      await network.provider.send("evm_mine");

      await this.crowdFunding.connect(this.address1).withdrawFunds(1);

      await this.myToken.connect(this.address1).balanceOf(this.address1.address).then((balance: any) => {
        expect(balance).to.greaterThan(100000);
      });
      
    });

    it("should be able to refund", async function () {
      await this.crowdFunding.connect(this.address1).createCampaign(1000,10000);

      await this.crowdFunding.connect(this.address2).contribute(1, 100);
      await this.crowdFunding.connect(this.address2).contribute(1, 50);

      await network.provider.send("evm_increaseTime", [9998]);
      await network.provider.send("evm_mine");

      await this.crowdFunding.connect(this.address2).refund(1);

      await this.myToken.connect(this.address2).balanceOf(this.address2.address).then((balance: any) => {
        expect(balance).to.equals(100000);
      });
    });
  });
});
