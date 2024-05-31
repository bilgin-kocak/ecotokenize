import { ethers } from 'ethers';
import zoraModuleManagerAbi from './abi/ZoraModuleManager.json';
import asks_V1_1Abi from './abi/AsksV1_1.json';
import offersV1Abi from './abi/OffersV1.json';
import reserveAuctionCoreERC20Abi from './abi/ReserveAuctionCoreErc20.json';
import hroabi from './abi/Erc721.json';
import {
  ERC20_TRANSFER_HELPER,
  ERC721_TRANSFER_HELPER,
  ZORA_MODULE_MANAGER,
  ASKS_V1_1,
  OFFER_V1,
  RESERVE_AUCTION_CORE_ERC20,
  TEST_NFT_CONTRACT_ADDRESS,
} from './contants/address';
const HON_ADDRESS = '0x0000000000000000000000000000000000000000';

export const getERC721TransferApprove = async (signer) => {
  const hroContract = new ethers.Contract(
    TEST_NFT_CONTRACT_ADDRESS,
    hroabi,
    signer
  );

  return await hroContract.isApprovedForAll(
    signer._address,
    ERC721_TRANSFER_HELPER
  );
};

export const setERC721TransferApprovedForAll = async (signer) => {
  const hroContract = new ethers.Contract(
    TEST_NFT_CONTRACT_ADDRESS,
    hroabi,
    signer
  );
  const tx = await hroContract.setApprovalForAll(ERC721_TRANSFER_HELPER, true);
  await tx.wait();
};

export const isAsksModuleApproved = async (signer) => {
  const zoraModuleManager = new ethers.Contract(
    ZORA_MODULE_MANAGER,
    zoraModuleManagerAbi,
    signer
  );

  const isAproved = await zoraModuleManager.isModuleApproved(
    signer._address,
    ASKS_V1_1
  );
  return isAproved;
};

export const isOfferModuleApproved = async (address, provider) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const zoraModuleManager = new ethers.Contract(
    ZORA_MODULE_MANAGER,
    zoraModuleManagerAbi,
    signer
  );

  const isAproved = await zoraModuleManager.isModuleApproved(address, OFFER_V1);
  return isAproved;
};

export const isReserveAuctionModuleApproved = async (address, provider) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const zoraModuleManager = new ethers.Contract(
    ZORA_MODULE_MANAGER,
    zoraModuleManagerAbi,
    signer
  );

  const isAproved = await zoraModuleManager.isModuleApproved(
    address,
    RESERVE_AUCTION_CORE_ERC20
  );
  return isAproved;
};

export const setApprovalForAsksModule = async (signer) => {
  const zoraModuleManager = new ethers.Contract(
    ZORA_MODULE_MANAGER,
    zoraModuleManagerAbi,
    signer
  );

  const tx = await zoraModuleManager.setApprovalForModule(ASKS_V1_1, true);
  await tx.wait();
};

export const registerModule = async (signer) => {
  const zoraModuleManager = new ethers.Contract(
    ZORA_MODULE_MANAGER,
    zoraModuleManagerAbi,
    signer
  );

  const tx = await zoraModuleManager.registerModule(
    '0x2f5Ad99Ee427C2A8679865BF2F991FE34525bab8'
  );
  await tx.wait();
};

export const setApprovalForOfferModule = async (address, provider) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const zoraModuleManager = new ethers.Contract(
    ZORA_MODULE_MANAGER,
    zoraModuleManagerAbi,
    signer
  );

  const tx = await zoraModuleManager.setApprovalForModule(OFFER_V1, true);
  await tx.wait();
};

export const setApprovalForReserveAuctionModule = async (address, provider) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const zoraModuleManager = new ethers.Contract(
    ZORA_MODULE_MANAGER,
    zoraModuleManagerAbi,
    signer
  );

  const tx = await zoraModuleManager.setApprovalForModule(
    RESERVE_AUCTION_CORE_ERC20,
    true
  );
  await tx.wait();
};

// ASK MODULE

export const createAsk = async (signer, tokenId, price) => {
  const asksV1_1 = new ethers.Contract(ASKS_V1_1, asks_V1_1Abi, signer);

  const value = ethers.utils.parseUnits(price, 'ether');

  const tx = await asksV1_1.createFixedSale(
    TEST_NFT_CONTRACT_ADDRESS, // contract address
    tokenId, // token id
    value, // NFT Price
    HON_ADDRESS, // payment token address
    signer._address, // price receiver address
    0, // Finder percentage
    {
      gasLimit: 500000,
    }
  );
  await tx.wait();
};

export const fillAsk = async (signer, tokenId, tokenContractAddress, price) => {
  const asksV1_1 = new ethers.Contract(ASKS_V1_1, asks_V1_1Abi, signer);

  const value = ethers.utils.parseUnits(price, 'ether');
  const tx = await asksV1_1.fillFixedSale(
    tokenContractAddress, // contract address
    tokenId, // token id
    HON_ADDRESS, // payment token address
    value, // payment amount
    '0x0000000000000000000000000000000000000000', // finder address
    {
      gasLimit: 500000,
      value: value,
    }
  );
  await tx.wait();
};

export const updateAskPrice = async (
  address,
  provider,
  tokenId,
  newPrice,
  name
) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const asksV1_1 = new ethers.Contract(ASKS_V1_1, asks_V1_1Abi, signer);

  const value = ethers.constants.WeiPerEther.mul(newPrice);
  const tx = await asksV1_1.setAskPrice(
    TEST_NFT_CONTRACT_ADDRESS, // contract address
    tokenId, // token id
    value, // payment amount
    HON_ADDRESS, // payment token address
    {
      gasLimit: 500000,
    }
  );
  await tx.wait();
};

export const cancelAsk = async (
  address,
  provider,
  tokenId,
  tokenContractAddress
) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const asksV1_1 = new ethers.Contract(ASKS_V1_1, asks_V1_1Abi, signer);

  const tx = await asksV1_1.cancelAsk(
    tokenContractAddress, // contract address
    tokenId, // token id
    {
      gasLimit: 500000,
    }
  );
  await tx.wait();
};

// OFFER MODULE

export const createOffer = async (
  address,
  provider,
  tokenId,
  tokenContract,
  price
) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const offer = new ethers.Contract(OFFER_V1, offersV1Abi, signer);

  const value = ethers.constants.WeiPerEther.mul(price);
  const tx = await offer.createOffer(
    tokenContract, // contract address
    tokenId, // token id
    HON_ADDRESS, // payment token address
    value, // NFT Price
    0, // Finder percentage

    {
      gasLimit: 500000,
    }
  );
  await tx.wait();
};

export const setOfferAmount = async (
  address,
  provider,
  tokenId,
  offerId,
  price
) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const offer = new ethers.Contract(OFFER_V1, offersV1Abi, signer);

  const value = ethers.constants.WeiPerEther.mul(price);
  const tx = await offer.setOfferAmount(
    TEST_NFT_CONTRACT_ADDRESS, // contract address
    tokenId, // token id
    offerId,
    HON_ADDRESS, // payment token address
    value, // NFT Price
    0, // Finder percentage
    {
      gasLimit: 500000,
    }
  );
  await tx.wait();
};

export const cancelOffer = async (address, provider, tokenId, offerId) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const offer = new ethers.Contract(OFFER_V1, offersV1Abi, signer);

  const tx = await offer.cancelOffer(
    TEST_NFT_CONTRACT_ADDRESS, // contract address
    tokenId, // token id
    offerId,
    {
      gasLimit: 500000,
    }
  );
  await tx.wait();
};

export const fillOffer = async (address, provider, tokenId, offerId, price) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const offer = new ethers.Contract(OFFER_V1, offersV1Abi, signer);

  const value = ethers.constants.WeiPerEther.mul(price);
  const tx = await offer.fillOffer(
    TEST_NFT_CONTRACT_ADDRESS, // contract address
    tokenId, // token id
    offerId,
    HON_ADDRESS, // payment token address
    value, // NFT Price
    '0x0000000000000000000000000000000000000000', // Finder address

    {
      gasLimit: 500000,
    }
  );
  await tx.wait();
};

// RESERVE AUCTION MODULE

export const createAuction = async (
  address,
  provider,
  tokenId,
  duration,
  startTime,
  price
) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const reserveAuction = new ethers.Contract(
    RESERVE_AUCTION_CORE_ERC20,
    reserveAuctionCoreERC20Abi,
    signer
  );

  const value = ethers.constants.WeiPerEther.mul(price);
  const tx = await reserveAuction.createAuction(
    TEST_NFT_CONTRACT_ADDRESS, // contract address
    tokenId, // token id
    duration, // duration
    value, // reserve price
    address, // seller funds recipient
    startTime, // start time
    HON_ADDRESS, // payment token address
    {
      gasLimit: 500000,
    }
  );
  await tx.wait();
};

export const setAuctionReservePrice = async (
  address,
  provider,
  tokenId,
  price
) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const reserveAuction = new ethers.Contract(
    RESERVE_AUCTION_CORE_ERC20,
    reserveAuctionCoreERC20Abi,
    signer
  );

  const value = ethers.constants.WeiPerEther.mul(price);
  const tx = await reserveAuction.setAuctionReservePrice(
    TEST_NFT_CONTRACT_ADDRESS, // contract address
    tokenId, // token id
    value, // reserve price
    {
      gasLimit: 500000,
    }
  );
  await tx.wait();
};

export const cancelAuction = async (address, provider, tokenId) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const reserveAuction = new ethers.Contract(
    RESERVE_AUCTION_CORE_ERC20,
    reserveAuctionCoreERC20Abi,
    signer
  );

  const tx = await reserveAuction.cancelAuction(
    TEST_NFT_CONTRACT_ADDRESS, // contract address
    tokenId, // token id
    {
      gasLimit: 500000,
    }
  );
  await tx.wait();
};

export const createBid = async (
  address,
  provider,
  tokenId,
  tokenContract,
  price
) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const reserveAuction = new ethers.Contract(
    RESERVE_AUCTION_CORE_ERC20,
    reserveAuctionCoreERC20Abi,
    signer
  );

  const value = ethers.constants.WeiPerEther.mul(price);
  const tx = await reserveAuction.createBid(
    tokenContract, // contract address
    tokenId, // token id
    value, // reserve price
    {
      gasLimit: 500000,
    }
  );
  await tx.wait();
};

export const settleAuction = async (address, provider, tokenId) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const reserveAuction = new ethers.Contract(
    RESERVE_AUCTION_CORE_ERC20,
    reserveAuctionCoreERC20Abi,
    signer
  );

  const tx = await reserveAuction.settleAuction(
    TEST_NFT_CONTRACT_ADDRESS, // contract address
    tokenId, // token id
    {
      gasLimit: 500000,
    }
  );
  await tx.wait();
};

export const getOwner = async (signer) => {
  const hroContract = new ethers.Contract(
    TEST_NFT_CONTRACT_ADDRESS,
    hroabi,
    signer
  );

  return await hroContract.owner();
};
