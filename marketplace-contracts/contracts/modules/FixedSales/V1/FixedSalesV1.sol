// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC721TransferHelper} from "../../../transferHelpers/ERC721TransferHelper.sol";
import {UniversalExchangeEventV1} from "../../../common/UniversalExchangeEvent/V1/UniversalExchangeEventV1.sol";
import {IncomingTransferSupportV1} from "../../../common/IncomingTransferSupport/V1/IncomingTransferSupportV1.sol";
import {FeePayoutSupportV1} from "../../../common/FeePayoutSupport/FeePayoutSupportV1.sol";
import {ModuleNamingSupportV1} from "../../../common/ModuleNamingSupport/ModuleNamingSupportV1.sol";

/// @notice This module allows sellers to list an owned ERC-721 token for sale for a given price in a given currency, and allows buyers to purchase from those fixedSales
contract FixedSalesV1 is ReentrancyGuard, UniversalExchangeEventV1, IncomingTransferSupportV1, FeePayoutSupportV1, ModuleNamingSupportV1 {
    /// @dev The indicator to pass all remaining gas when paying out royalties
    uint256 private constant USE_ALL_GAS_FLAG = 0;

    /// @notice The ERC-721 Transfer Helper
    ERC721TransferHelper public immutable erc721TransferHelper;

    /// @notice The fixedSale for a given NFT, if one exists
    /// @dev ERC-721 token contract => ERC-721 token ID => FixedSale
    mapping(address => mapping(uint256 => FixedSale)) public fixedSaleForNFT;

    /// @notice The metadata for an fixedSale
    /// @param seller The address of the seller placing the fixedSale
    /// @param sellerFundsRecipient The address to send funds after the fixedSale is filled
    /// @param fixedSaleCurrency The address of the ERC-20, or address(0) for ETH, required to fill the fixedSale
    /// @param findersFeeBps The fee to the referrer of the fixedSale
    /// @param fixedSalePrice The price to fill the fixedSale
    struct FixedSale {
        address seller;
        address sellerFundsRecipient;
        address fixedSaleCurrency;
        uint16 findersFeeBps;
        uint256 fixedSalePrice;
    }

    /// @notice Emitted when an fixedSale is created
    /// @param tokenContract The ERC-721 token address of the created fixedSale
    /// @param tokenId The ERC-721 token ID of the created fixedSale
    /// @param fixedSale The metadata of the created fixedSale
    event FixedSaleCreated(address indexed tokenContract, uint256 indexed tokenId, FixedSale fixedSale);

    /// @notice Emitted when an fixedSale price is updated
    /// @param tokenContract The ERC-721 token address of the updated fixedSale
    /// @param tokenId The ERC-721 token ID of the updated fixedSale
    /// @param fixedSale The metadata of the updated fixedSale
    event FixedSalePriceUpdated(address indexed tokenContract, uint256 indexed tokenId, FixedSale fixedSale);

    /// @notice Emitted when an fixedSale is canceled
    /// @param tokenContract The ERC-721 token address of the canceled fixedSale
    /// @param tokenId The ERC-721 token ID of the canceled fixedSale
    /// @param fixedSale The metadata of the canceled fixedSale
    event FixedSaleCanceled(address indexed tokenContract, uint256 indexed tokenId, FixedSale fixedSale);

    /// @notice Emitted when an fixedSale is filled
    /// @param tokenContract The ERC-721 token address of the filled fixedSale
    /// @param tokenId The ERC-721 token ID of the filled fixedSale
    /// @param buyer The buyer address of the filled fixedSale
    /// @param finder The address of finder who referred the fixedSale
    /// @param fixedSale The metadata of the filled fixedSale
    event FixedSaleFilled(address indexed tokenContract, uint256 indexed tokenId, address indexed buyer, address finder, FixedSale fixedSale);

    /// @param _erc20TransferHelper The  ERC-20 Transfer Helper address
    /// @param _erc721TransferHelper The  ERC-721 Transfer Helper address
    /// @param _royaltyEngine The Manifold Royalty Engine address
    /// @param _protocolFeeSettings The ProtocolFeeSettingsV1 address
    /// @param _wethAddress The WETH token address
    constructor(
        address _erc20TransferHelper,
        address _erc721TransferHelper,
        address _royaltyEngine,
        address _protocolFeeSettings,
        address _wethAddress
    )
        IncomingTransferSupportV1(_erc20TransferHelper)
        FeePayoutSupportV1(_royaltyEngine, _protocolFeeSettings, _wethAddress, ERC721TransferHelper(_erc721TransferHelper).ZMM().registrar())
        ModuleNamingSupportV1("FixedSales: v1.1")
    {
        erc721TransferHelper = ERC721TransferHelper(_erc721TransferHelper);
    }

    
    /// @notice Creates the fixedSale for a given NFT
    /// @param _tokenContract The address of the ERC-721 token to be sold
    /// @param _tokenId The ID of the ERC-721 token to be sold
    /// @param _fixedSalePrice The price to fill the fixedSale
    /// @param _fixedSaleCurrency The address of the ERC-20 token required to fill, or address(0) for ETH
    /// @param _sellerFundsRecipient The address to send funds once the fixedSale is filled
    /// @param _findersFeeBps The bps of the fixedSale price (post-royalties) to be sent to the referrer of the sale
    function createFixedSale(
        address _tokenContract,
        uint256 _tokenId,
        uint256 _fixedSalePrice,
        address _fixedSaleCurrency,
        address _sellerFundsRecipient,
        uint16 _findersFeeBps
    ) external nonReentrant {
        address tokenOwner = IERC721(_tokenContract).ownerOf(_tokenId);

        require(
            msg.sender == tokenOwner || IERC721(_tokenContract).isApprovedForAll(tokenOwner, msg.sender),
            "createFixedSale must be token owner or operator"
        );
        require(erc721TransferHelper.isModuleApproved(msg.sender), "createFixedSale must approve FixedSalesV1 module");
        require(
            IERC721(_tokenContract).isApprovedForAll(tokenOwner, address(erc721TransferHelper)),
            "createFixedSale must approve ERC721TransferHelper as operator"
        );
        require(_findersFeeBps <= 10000, "createFixedSale finders fee bps must be less than or equal to 10000");
        require(_sellerFundsRecipient != address(0), "createFixedSale must specify _sellerFundsRecipient");

        if (fixedSaleForNFT[_tokenContract][_tokenId].seller != address(0)) {
            _cancelFixedSale(_tokenContract, _tokenId);
        }

        fixedSaleForNFT[_tokenContract][_tokenId] = FixedSale({
            seller: tokenOwner,
            sellerFundsRecipient: _sellerFundsRecipient,
            fixedSaleCurrency: _fixedSaleCurrency,
            findersFeeBps: _findersFeeBps,
            fixedSalePrice: _fixedSalePrice
        });

        emit FixedSaleCreated(_tokenContract, _tokenId, fixedSaleForNFT[_tokenContract][_tokenId]);
    }

    /// @notice Updates the fixedSale price for a given NFT
    /// @param _tokenContract The address of the ERC-721 token
    /// @param _tokenId The ID of the ERC-721 token
    /// @param _fixedSalePrice The fixedSale price to set
    /// @param _fixedSaleCurrency The address of the ERC-20 token required to fill, or address(0) for ETH
    function setFixedSalePrice(
        address _tokenContract,
        uint256 _tokenId,
        uint256 _fixedSalePrice,
        address _fixedSaleCurrency
    ) external nonReentrant {
        FixedSale storage fixedSale = fixedSaleForNFT[_tokenContract][_tokenId];

        require(fixedSale.seller == msg.sender, "setFixedSalePrice must be seller");

        fixedSale.fixedSalePrice = _fixedSalePrice;
        fixedSale.fixedSaleCurrency = _fixedSaleCurrency;

        emit FixedSalePriceUpdated(_tokenContract, _tokenId, fixedSale);
    }

    /// @notice Cancels the fixedSale for a given NFT
    /// @param _tokenContract The address of the ERC-721 token
    /// @param _tokenId The ID of the ERC-721 token
    function cancelFixedSale(address _tokenContract, uint256 _tokenId) external nonReentrant {
        require(fixedSaleForNFT[_tokenContract][_tokenId].seller != address(0), "cancelFixedSale fixedSale doesn't exist");

        address tokenOwner = IERC721(_tokenContract).ownerOf(_tokenId);
        require(
            msg.sender == tokenOwner || IERC721(_tokenContract).isApprovedForAll(tokenOwner, msg.sender),
            "cancelFixedSale must be token owner or operator"
        );

        _cancelFixedSale(_tokenContract, _tokenId);
    }

    /// @notice Fills the fixedSale for a given NFT, transferring the ETH/ERC-20 to the seller and NFT to the buyer
    /// @param _tokenContract The address of the ERC-721 token
    /// @param _tokenId The ID of the ERC-721 token
    /// @param _fillCurrency The address of the ERC-20 token using to fill, or address(0) for ETH
    /// @param _fillAmount The amount to fill the fixedSale
    /// @param _finder The address of the fixedSale referrer
    function fillFixedSale(
        address _tokenContract,
        uint256 _tokenId,
        address _fillCurrency,
        uint256 _fillAmount,
        address _finder
    ) external payable nonReentrant {
        FixedSale storage fixedSale = fixedSaleForNFT[_tokenContract][_tokenId];

        require(fixedSale.seller != address(0), "fillFixedSale must be active fixedSale");
        require(fixedSale.fixedSaleCurrency == _fillCurrency, "fillFixedSale _fillCurrency must match fixedSale currency");
        require(fixedSale.fixedSalePrice == _fillAmount, "fillFixedSale _fillAmount must match fixedSale amount");

        // Ensure ETH/ERC-20 payment from buyer is valid and take custody
        _handleIncomingTransfer(fixedSale.fixedSalePrice, fixedSale.fixedSaleCurrency);

        // Payout respective parties, ensuring royalties are honored
        (uint256 remainingProfit, ) = _handleRoyaltyPayout(_tokenContract, _tokenId, fixedSale.fixedSalePrice, fixedSale.fixedSaleCurrency, USE_ALL_GAS_FLAG);

        // Payout optional protocol fee
        remainingProfit = _handleProtocolFeePayout(remainingProfit, fixedSale.fixedSaleCurrency);

        // Payout optional finder fee
        if (_finder != address(0)) {
            uint256 findersFee = (remainingProfit * fixedSale.findersFeeBps) / 10000;
            _handleOutgoingTransfer(_finder, findersFee, fixedSale.fixedSaleCurrency, USE_ALL_GAS_FLAG);

            remainingProfit = remainingProfit - findersFee;
        }

        // Transfer remaining ETH/ERC-20 to seller
        _handleOutgoingTransfer(fixedSale.sellerFundsRecipient, remainingProfit, fixedSale.fixedSaleCurrency, USE_ALL_GAS_FLAG);

        // Transfer NFT to buyer
        erc721TransferHelper.transferFrom(_tokenContract, fixedSale.seller, msg.sender, _tokenId);

        ExchangeDetails memory userAExchangeDetails = ExchangeDetails({tokenContract: _tokenContract, tokenId: _tokenId, amount: 1});
        ExchangeDetails memory userBExchangeDetails = ExchangeDetails({tokenContract: fixedSale.fixedSaleCurrency, tokenId: 0, amount: fixedSale.fixedSalePrice});

        emit ExchangeExecuted(fixedSale.seller, msg.sender, userAExchangeDetails, userBExchangeDetails);
        emit FixedSaleFilled(_tokenContract, _tokenId, msg.sender, _finder, fixedSale);

        delete fixedSaleForNFT[_tokenContract][_tokenId];
    }

    /// @dev Deletes canceled and invalid fixedSales
    /// @param _tokenContract The address of the ERC-721 token
    /// @param _tokenId The ID of the ERC-721 token
    function _cancelFixedSale(address _tokenContract, uint256 _tokenId) private {
        emit FixedSaleCanceled(_tokenContract, _tokenId, fixedSaleForNFT[_tokenContract][_tokenId]);

        delete fixedSaleForNFT[_tokenContract][_tokenId];
    }
}
