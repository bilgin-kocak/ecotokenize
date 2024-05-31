import axios from 'axios';
import { ethers } from 'ethers';
import { cryptopunks_metadata } from '../data/cryptopunks_metadata';

export const getAsks = async () => {
  try {
    console.log('fetching asks');
    const {
      data: { data },
    } = await axios.post(
      // 'https://api.subquery.network/sq/bilgin-kocak/areon-marketplace',
      'https://api.subquery.network/sq/bilgin-kocak/dene',
      {
        query: `query {asks (first: 25) {
          nodes {
              id
              tokenID
              tokenContract
              seller
              sellerFundsRecipient
              askPrice
              askCurrency
              createdAtTimestamp
          }}
      }`,
      }
    );
    let tokens = data.asks.nodes.map((node) => {
      const metadata = cryptopunks_metadata.find(
        (item) => item.token_id === node.tokenID
      );
      return {
        ...node,
        metadata,
      };
    });

    tokens = tokens.map((token) => {
      return {
        ...token,
        metadata: {
          ...token.metadata,
          metadata: JSON.parse(token.metadata.metadata),
        },
      };
    });

    tokens = tokens.map((token) => {
      return {
        ...token,
        id: token.metadata.metadata.name,
        image: token.metadata.metadata.image,
        title: token.metadata.metadata.name,
        price: '8.49 ETH',
        bidLimit: 1,
        bidCount: 8,
        likes: 15,
        react_number: 159,
        bid_number: 0.01,
        eth_number: ethers.utils.formatEther(token.askPrice),
        creator: { name: 'bilgin', image: '/images/avatars/creator_1.png' },
        owner_: { name: 'bilgin', image: '/images/avatars/owner_1.png' },
      };
    });

    return tokens;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getUserNfts = async (walletAdress) => {
  const {
    data: { data },
  } = await axios.post(
    // 'https://api.subquery.network/sq/bilgin-kocak/areon-marketplace',
    'https://api.subquery.network/sq/bilgin-kocak/dene',
    {
      query: `query {
            nfts(first: 25, filter: {owner: {equalTo: "${walletAdress}"}}) {
              nodes {
                id
                tokenContract
                owner
                createdAtTimestamp
                tokenID
              }
            }
          }`,
    }
  );

  // combine token metadata using tokenID
  let tokens = data.nfts.nodes.map((node) => {
    const metadata = cryptopunks_metadata.find(
      (item) => item.token_id === node.tokenID
    );
    return {
      ...node,
      metadata,
    };
  });

  tokens = tokens.map((token) => {
    return {
      ...token,
      metadata: {
        ...token.metadata,
        metadata: JSON.parse(token.metadata.metadata),
      },
    };
  });

  tokens = tokens.map((token) => {
    return {
      ...token,
      id: token.metadata.metadata.name,
      image: token.metadata.metadata.image,
      title: token.metadata.metadata.name,
      price: '8.49 ETH',
      bidLimit: 1,
      bidCount: 8,
      likes: 15,
      creator: { name: 'bilgin', image: '/images/avatars/creator_1.png' },
      owner_: { name: 'bilgin', image: '/images/avatars/owner_1.png' },
    };
  });

  return tokens;
};

export const getAllNfts = async () => {
  const {
    data: { data },
  } = await axios.post(
    // 'https://api.subquery.network/sq/bilgin-kocak/areon-marketplace',
    'https://api.subquery.network/sq/bilgin-kocak/dene',
    {
      query: `query {
            nfts(first: 25) {
              nodes {
                id
                tokenContract
                owner
                createdAtTimestamp
                tokenID
              }
            }
          }`,
    }
  );

  // combine token metadata using tokenID
  let tokens = data.nfts.nodes.map((node) => {
    const metadata = cryptopunks_metadata.find(
      (item) => item.token_id === node.tokenID
    );
    return {
      ...node,
      metadata,
    };
  });

  tokens = tokens.map((token) => {
    return {
      ...token,
      metadata: {
        ...token.metadata,
        metadata: JSON.parse(token.metadata.metadata),
      },
    };
  });

  tokens = tokens.map((token) => {
    return {
      ...token,
      id: token.metadata.metadata.name,
      image: token.metadata.metadata.image,
      title: token.metadata.metadata.name,
      price: '8.49 ETH',
      bidLimit: 1,
      bidCount: 8,
      likes: 15,
      creator: { name: 'bilgin', image: '/images/avatars/creator_1.png' },
      owner_: { name: 'bilgin', image: '/images/avatars/owner_1.png' },
    };
  });

  return tokens;
};
