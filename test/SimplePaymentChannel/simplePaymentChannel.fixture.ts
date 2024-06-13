import { ethers } from "hardhat";

import type { SimplePaymentChannel } from "../../types/SimplePaymentChannel";
import type { SimplePaymentChannel__factory } from "../../types/factories/SimplePaymentChannel__factory";


export async function deployLockFixture() {
    const [owner, address1] = await ethers.getSigners();

    const SimplePaymentChannel = (await ethers.getContractFactory("SimplePaymentChannel")) as SimplePaymentChannel__factory;
    const simplePaymentChannel = (await SimplePaymentChannel.deploy(address1)) as SimplePaymentChannel;
    const simplePaymentChannel_address = await simplePaymentChannel.getAddress();

    return {
        simplePaymentChannel,
        simplePaymentChannel_address,
        owner,
        address1
    };
}