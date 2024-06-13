import { ethers } from "hardhat";

import type { CrowdFunding } from "../../types/CrowdFunding";
import type { CrowdFunding__factory } from "../../types/factories/CrowdFunding__factory";

import type { MyToken } from "../../types/MyToken";
import type { MyToken__factory } from "../../types/factories/MyToken__factory";

export async function deployLockFixture() {
  const [owner, address1, address2] = await ethers.getSigners();

  const MyToken = (await ethers.getContractFactory(
    "MyToken"
  )) as MyToken__factory;
  const myToken = (await MyToken.connect(owner).deploy(
    "Token",
    "TKN",
    5
  )) as MyToken;
  const myToken_address = await myToken.getAddress();

  await myToken.connect(owner).mint(address1.address, 100000);
  await myToken.connect(owner).mint(address2.address, 100000);

  const CrowdFunding = (await ethers.getContractFactory(
    "CrowdFunding"
  )) as CrowdFunding__factory;
  const crowdFunding = (await CrowdFunding.deploy(
    myToken_address
  )) as CrowdFunding;
  const crowdFunding_address = await crowdFunding.getAddress();

  await myToken.connect(address1).approve(crowdFunding_address, 100000);
  await myToken.connect(address2).approve(crowdFunding_address, 100000);

  return {
    myToken,
    myToken_address,
    crowdFunding,
    crowdFunding_address,
    owner,
    address1,
    address2,
  };
}
