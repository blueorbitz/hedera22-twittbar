import { HashConnect } from "hashconnect";

const appMetadata = {
  name: "dApp Example",
  description: "An example hedera dApp",
  icon: "https://absolute.url/to/icon.png"
}

let hashconnect;
let availableExtensions = [];
let saveData = {
  topic: "",
  pairingString: "",
  privateKey: "",
  pairedWalletData: null,
  pairedAccounts: []
}

const loadLocalData = () => {
  let foundData = localStorage.getItem("hashconnectData");
  if (foundData) {
    saveData = JSON.parse(foundData);
    return true;
  }
  else
    return false;
}

const saveDataInLocalstorage = () => {
  let data = JSON.stringify(this.saveData);
  localStorage.setItem("hashconnectData", data);
}

const initHashconnect = async () => {
  //create the hashconnect instance
  hashconnect = new HashConnect();

  if (!loadLocalData()) {
    //first init and store the private for later
    let initData = await hashconnect.init(appMetadata);
    saveData.privateKey = initData.privKey;
    console.log(saveData.privateKey + ' this is the priv key');

    //then connect, storing the new topic for later
    const state = await hashconnect.connect();
    saveData.topic = state.topic;

    //generate a pairing string, which you can display and generate a QR code from
    saveData.pairingString = hashconnect.generatePairingString(state, "testnet", true);

    hashconnect.findLocalWallets();
    hashconnect.connectToLocalWallet(saveData.pairingString);
  }
  else {
    //use loaded data for initialization + connection
    await hashconnect.init(appMetadata, saveData.privateKey);
    await hashconnect.connect(saveData.topic, saveData.pairedWalletData);
  }

  setUpEvents();
  return hashconnect;
}

const setUpEvents = () => {
  if (hashconnect == null)
    return;

  hashconnect.foundExtensionEvent.on((data) => {
    availableExtensions.push(data);
    console.log("Found extension", data);
  })

  // hashconnect.additionalAccountResponseEvent.on((data) => {
  //     console.log("Received account info", data);

  //     data.accountIds.forEach(id => {
  //         if(this.saveData.pairedAccounts.indexOf(id) == -1)
  //             this.saveData.pairedAccounts.push(id);
  //     })
  // })

  hashconnect.pairingEvent.on((data) => {
    console.log("Paired with wallet", data);
    saveData.pairedWalletData = data.metadata;

    data.accountIds.forEach(id => {
      if (saveData.pairedAccounts.indexOf(id) == -1)
        saveData.pairedAccounts.push(id);
    })

    saveDataInLocalstorage();
  });


  this.hashconnect.transactionEvent.on((data) => {
    //this will not be common to be used in a dapp
    console.log("transaction event callback");
  });
}

export default initHashconnect;