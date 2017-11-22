#!/usr/bin/env bash
echo "Initializing IPFS and TestRPC" &&
(testrpc > /dev/null &) &&
export IPFS_PATH=.ipfs &&
rm -rf $IPFS_PATH &&
jsipfs init > /dev/null &&
jsipfs bootstrap rm --all &&
(jsipfs daemon > /dev/null &) &&
truffle compile &&
truffle test;
sleep 1 &&
pkill -f testrpc;
pkill -f jsipfs