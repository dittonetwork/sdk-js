import { Contract, Wallet, ethers, providers } from "ethers";
import { config } from "dotenv";

import { abi as factoryAbi } from "./IVaultFactory.json";
import { abi as vaultAbi } from "./IUniversalVault.json";

// private zone ////////////////////////////////////////////////////////
// const protocolFees = "0x98be985a9D1F178b96629D837b2e8640515A434C"; //
////////////////////////////////////////////////////////////////////////

const factoryAddress = "0xd80372247b20Bf3D726FebfbD79Ad5145875a328";
const vaultId = 1;

config();

const provider = new providers.JsonRpcProvider(process.env.MUM_RPC_URL);

const signer = new Wallet(process.env.PRIVATE_KEY ?? "", provider);

const contractFactory = new Contract(factoryAddress, factoryAbi, signer);

async function main() {
    const vault = await contractFactory.predictDeterministicVaultAddress(
        signer.address,
        vaultId
    );
    console.log(vault);

    // deploy
    const vaultCodeSize = (await provider.getCode(vault)).length;
    let tx;

    if (vaultCodeSize === 0) {
        tx = await contractFactory.deploy(1, vaultId);
        console.log(await tx.wait());
    }

    const vaultContract = new Contract(vault, vaultAbi, signer);

    // deposit to vault
    const vaultBalance = await provider.getBalance(vault);
    if (vaultBalance.eq(0)) {
        tx = await vaultContract.depositNative({
            value: 100000000000000000n, // 0.1e18
        });
        console.log(await tx.wait());
    }

    // add workflow
    const nextWfKey = await vaultContract.getNextWorkflowKey();

    const checkerArr = [
        [
            vaultContract.interface
                .encodeFunctionData("checkTime", [ethers.utils.randomBytes(32)])
                .slice(0, -64),
            vaultContract.interface
                .encodeFunctionData("checkTimeView", [
                    ethers.utils.randomBytes(32),
                ])
                .slice(0, -64),
            ethers.utils.solidityKeccak256(
                ["string"],
                [`timeChecker_${nextWfKey}`]
            ),
            vaultContract.interface
                .encodeFunctionData("timeCheckerInitialize", [
                    ethers.BigNumber.from(BigInt(Date.now()) / 1000n),
                    300, // 5 min
                    ethers.utils.randomBytes(32),
                ])
                .slice(0, -64),
        ],
    ];

    const actionArr = [
        [
            vaultContract.interface.encodeFunctionData("withdrawNative", [
                vault,
                10000000000000000n, // 0.01e18
            ]),
            "0x",
            "0x",
        ],
    ];

    const addWfCalldata = vaultContract.interface.encodeFunctionData(
        "addWorkflow",
        [checkerArr, actionArr, signer.address, 1]
    );

    tx = await vaultContract.multicall([addWfCalldata]);
    console.log(await tx.wait());

    // console.log(await vaultContract.canExecWorkflowCheck(0));
}

main();
