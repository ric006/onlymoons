import React, { useContext, useEffect, useState } from 'react'
import tw from 'tailwind-styled-components'
import { BigNumber, utils } from 'ethers'
import { UtilContractContext } from './contracts/Util'
import { PriceTrackerContext } from './contracts/PriceTracker'
import { useWeb3React } from '@web3-react/core'
import { getNetworkDataByChainId, getFormattedAmount } from '../util'
import { LPData, NetworkData, TokenData } from '../typings'
import humanNumber from 'human-number'

const { formatUnits } = utils

const Outer = tw.div`
  flex
  justify-start
  items-center
  gap-2
`

const Amount = tw.div`

`

const Value = tw.div`

`

const ValueInner = tw.span`
  
`

export interface TokenWithValueProps {
  amount: BigNumber
  tokenData: TokenData
  showAmount?: boolean
  showValue?: boolean
}

const TokenWithValue: React.FC<TokenWithValueProps> = ({ amount, tokenData, showAmount = true, showValue = true }) => {
  const { chainId } = useWeb3React()
  const { getLpData } = useContext(UtilContractContext)
  const { isSupportedToken, getPriceForPair } = useContext(PriceTrackerContext) || {}
  const [networkData, setNetworkData] = useState<NetworkData>()
  const [lpData, setLpData] = useState<LPData>()
  // const [pairedTokenData, setPairedTokenData] = useState<TokenData>()
  const [supported, setSupported] = useState<boolean>(false)
  const [price, setPrice] = useState<number>()

  useEffect(() => {
    setNetworkData(chainId ? getNetworkDataByChainId(chainId) : undefined)
  }, [chainId])

  useEffect(() => {
    setSupported(isSupportedToken && isSupportedToken(tokenData.address) ? true : false)
  }, [tokenData.address, isSupportedToken])

  useEffect(() => {
    if (!networkData || !getLpData || !tokenData.address || !supported) {
      setLpData(undefined)
      return
    }

    const supportedPair = networkData.supportedLiquidityPairTokens.find(pair => pair.address === tokenData.address)

    if (!supportedPair) {
      setLpData(undefined)
      return
    }

    getLpData(supportedPair.stablePair)
      .then((lpData?: LPData) =>
        lpData ? Promise.resolve(lpData) : Promise.reject(new Error('Failed to get LP data')),
      )
      .then(setLpData)
      .catch((err: Error) => {
        console.error(err)
        setLpData(undefined)
      })

    // getPriceForPair(networkData.supportedLiquidityPairTokens.find())
  }, [tokenData.address, supported, networkData, getLpData])

  // useEffect(() => {
  //   if (!lpData || !getTokenData || !showValue) {
  //     setPairedTokenData(undefined)
  //     return
  //   }

  //   getTokenData(lpData.token0 === tokenData.address ? lpData.token1 : lpData.token0)
  //     .then(setPairedTokenData)
  //     .catch((err: Error) => {
  //       console.error(err)
  //       setPairedTokenData(undefined)
  //     })
  // }, [tokenData.address, lpData, getTokenData, showValue])

  useEffect(() => {
    if (!getPriceForPair || !lpData) {
      setPrice(0)
      return
    }

    getPriceForPair(lpData)
      .then(setPrice)
      .catch((err: Error) => {
        console.error(err)
        setPrice(0)
      })
  }, [lpData, getPriceForPair])

  return (
    <Outer>
      {showAmount ? (
        <>
          <Amount>
            {getFormattedAmount(amount, tokenData.decimals)} {tokenData.symbol}
            {/* {humanNumber(parseFloat(formatUnits(amount, tokenData.decimals)), n =>
              n.toLocaleString(undefined, { maximumFractionDigits: tokenData.decimals }),
            )}{' '}
            {tokenData.symbol} */}
          </Amount>
        </>
      ) : (
        <></>
      )}

      {showValue && price ? (
        <>
          <Value>
            (
            <ValueInner>
              $
              {humanNumber(parseFloat(formatUnits(amount, tokenData.decimals)) * price, n =>
                n.toLocaleString(undefined, { maximumFractionDigits: 2 }),
              )}
            </ValueInner>
            )
          </Value>
        </>
      ) : (
        <></>
      )}
    </Outer>
  )
}

export default TokenWithValue