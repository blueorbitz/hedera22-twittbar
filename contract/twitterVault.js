// console.clear();
require("dotenv").config();
const {ApiSession, Contract} = require("@buidlerlabs/hedera-strato-js");

async function CreateNewContract() {
  const { session } = await ApiSession.default();
  const receiptsSubscription = session.subscribeToReceiptsWith(
    ({ transaction, receipt }) => {
      console.log(`${receipt.status} ${transaction.constructor.name}: ${transaction.transactionId} ${transaction.transactionMemo}`);
    }
  );

  const vaultContract = await Contract.newFrom({ path: './TwitterVault.sol' });
  const liveContract = await session.upload(vaultContract, {_file: { fileMemo: "Hello Strato" }});
  console.log(`Contract Create ContractId: ${liveContract.id} (Solidity ${liveContract.id.toSolidityAddress()})`);

  return { session, liveContract };
}

async function ConnectToContract(contractId = "0.0.34362599") {
  const { session } = await ApiSession.default();
  const receiptsSubscription = session.subscribeToReceiptsWith(
    ({ transaction, receipt }) => {
      console.log(`${receipt.status} ${transaction.constructor.name}: ${transaction.transactionId} ${transaction.transactionMemo}`);
    }
  );
  
  const vaultContract = await Contract.newFrom({ path: './TwitterVault.sol' });
  const liveContract = await session.getLiveContract({ id: contractId, abi: vaultContract.interface });
  return { session, liveContract };
}

async function main() {
  const { liveContract } = await ConnectToContract();
  console.log(Object.keys(liveContract.interface.functions));
}

main();
