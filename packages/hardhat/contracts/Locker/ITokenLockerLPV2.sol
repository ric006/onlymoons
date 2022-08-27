// SPDX-License-Identifier: GPL-3.0+

/**
  /$$$$$$            /$$           /$$      /$$                                        
 /$$__  $$          | $$          | $$$    /$$$                                        
| $$  \ $$ /$$$$$$$ | $$ /$$   /$$| $$$$  /$$$$  /$$$$$$   /$$$$$$  /$$$$$$$   /$$$$$$$
| $$  | $$| $$__  $$| $$| $$  | $$| $$ $$/$$ $$ /$$__  $$ /$$__  $$| $$__  $$ /$$_____/
| $$  | $$| $$  \ $$| $$| $$  | $$| $$  $$$| $$| $$  \ $$| $$  \ $$| $$  \ $$|  $$$$$$ 
| $$  | $$| $$  | $$| $$| $$  | $$| $$\  $ | $$| $$  | $$| $$  | $$| $$  | $$ \____  $$
|  $$$$$$/| $$  | $$| $$|  $$$$$$$| $$ \/  | $$|  $$$$$$/|  $$$$$$/| $$  | $$ /$$$$$$$/
 \______/ |__/  |__/|__/ \____  $$|__/     |__/ \______/  \______/ |__/  |__/|_______/ 
                         /$$  | $$                                                     
                        |  $$$$$$/                                                     
                         \______/                                                      

  https://onlymoons.io/
*/

pragma solidity ^0.8.0;

import { ITokenLockerManagerV2 } from "./ITokenLockerManagerV2.sol";
import { ITokenLockerBaseV2 } from "./ITokenLockerBaseV2.sol";


interface ITokenLockerLPV2 is ITokenLockerManagerV2, ITokenLockerBaseV2 {
  event Extended(uint40 id, uint40 newUnlockTime);
  event Deposited(uint40 id, uint256 amountOrTokenId);
  event Withdrew(uint40 id);
  event LockOwnershipTransfered(
    uint40 id,
    address oldOwner,
    address newOwner
  );

  function withdrawById(
    uint40 id_
  ) external;
  function migrate(
    uint40 id_,
    address oldRouterAddress_,
    address newRouterAddress_
  ) external;
  function setSocialsById(
    uint40 id_,
    string[] calldata keys_,
    string[] calldata urls_
  ) external;
  function getUrlForSocialKeyById(
    uint40 id_,
    string calldata key_
  ) external view returns (
    string memory
  );
  // function getLockData() external returns (
  //   bool isLpToken,
  //   uint40 id,
  //   address contractAddress,
  //   address lockOwner,
  //   address token,
  //   address createdBy,
  //   uint40 createdAt,
  //   uint40 unlockTime,
  //   uint256 balance,
  //   uint256 totalSupply
  // );
}
