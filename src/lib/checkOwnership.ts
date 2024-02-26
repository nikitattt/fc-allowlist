import { createPublicClient, fallback, http } from 'viem'
import { mainnet } from 'viem/chains'

import erc721ABI from './abi/erc721.json'
import erc1155ABI from './abi/erc1155.json'

const ANKR_KEY = process.env.ANKR_KEY

// supported chains: eth, base

export async function checkOwnership(
  userAddresses: string[],
  chain: string,
  tokenAddress: string,
  tokenId?: string
) {
  const ankr = http(`https://rpc.ankr.com/${chain}/${ANKR_KEY}`)

  const client = createPublicClient({
    chain: mainnet,
    transport: fallback([ankr]),
    batch: {
      multicall: true
    }
  })

  const calls = userAddresses.map((userAddress) =>
    constructContractCall(
      userAddress as '0x${string}',
      tokenAddress as '0x${string}',
      tokenId
    )
  )

  const results = await client.multicall({
    //@ts-ignore
    contracts: calls
  })

  //   console.log(results)

  for (const r of results) {
    // check this
    if (r.result && Number(r.result) >= 1) {
      console.log('ownership check passed')
      return true
    }
  }

  console.log('ownership check failed')

  return false
}

export const constructContractCall = (
  userAddress: '0x${string}',
  tokenAddress: '0x${string}',
  tokenId?: string
) => {
  return {
    address: tokenAddress,
    abi: tokenId ? erc1155ABI : erc721ABI,
    functionName: 'balanceOf',
    args: tokenId ? [userAddress, tokenId] : [userAddress]
  } as const
}
