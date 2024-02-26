import { NextRequest, NextResponse } from 'next/server'
import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit'
import Redis from 'ioredis'
import { VideoShareData } from '@/utils/types'
import { checkOwnership } from '@/lib/checkOwnership'

const NEYNAR_KEY = process.env.NEYNAR_KEY

const redisClient = new Redis(process.env.REDIS_URL!)

export const dynamic = 'force-dynamic'

// eth/base
const allowlistCollectionData = [
  {
    id: 'groupies',
    requirements: [
      'eth:0x4f89Cd0CAE1e54D98db6a80150a824a533502EEa',
      'base:0x2ad08B1132cB4f969361FD0Aa9beeB8e55776Bbc:1'
    ]
  },
  {
    id: 'jeeves',
    requirements: ['base:0x66F3c79166Cc7049Da0B4C43038ca49fED98c568']
  },
  {
    id: 'outcasts',
    requirements: ['base:0x66F3c79166Cc7049Da0B4C43038ca49fED98c568']
  }
]

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body: FrameRequest = await req.json()

  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: NEYNAR_KEY
  })

  if (!isValid) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const wallets = message.interactor.verified_addresses.eth_addresses

  if (!wallets || wallets.length === 0) {
    const imageUrl = `${process.env.HOST}/no-wallets.jpg`

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>No wallets!</title>
          <meta property="og:title" content="You need to add at least 1 wallet!" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
        </head>
        <body />
      </html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html'
        }
      }
    )
  }

  // console.log(wallets)

  const id = params.id

  const data = allowlistCollectionData.find((d) => d.id === id)

  if (!data) {
    return new NextResponse('Not found', { status: 404 })
  }

  // console.log(data)

  let ownershipPassed = false

  for (const req of data.requirements) {
    const requirement = req.split(':')
    const chain = requirement[0]
    const address = requirement[1]
    const tokenId = requirement[2]

    console.log('fid', message.interactor.fid, 'wallets', wallets)

    const oP = await checkOwnership(wallets, chain, address, tokenId)
    if (oP) {
      ownershipPassed = true

      const userFid = message.interactor.fid

      const redisKey = `allowlist-${id}-${userFid}`
      const redisData = {
        user: message.interactor
      }

      const res = await redisClient.set(redisKey, JSON.stringify(redisData))
      res === 'OK'
        ? console.log(`redis allowlist sign up with fid ${userFid}`)
        : console.error(`fail: redis allowlist sign up with fid ${userFid}`)

      break
    }
  }

  // const requirement = data.requirements.split(':')
  // const chain = requirement[0]
  // const address = requirement[1]
  // const tokenId = requirement[2]

  // const ownershipPassed = await checkOwnership(wallets, chain, address, tokenId)

  let response

  if (ownershipPassed) {
    // const postUrl = `https://lvpr.tv?v=${data.playbackId}`
    const imageUrl = `${process.env.HOST}/allowlist-signup-success.jpg`

    // let videoMeta = ``

    // if (data.playbackUrl) {
    //   videoMeta = `
    //   <meta property="fc:frame:video" content="${data.playbackUrl}" />
    //   <meta property="fc:frame:video:type" content="application/x-mpegURL" />`
    // }

    // <meta property="fc:frame:button:1" content="Watch in browser" />
    //       <meta property="fc:frame:button:1:action" content="link" />
    //       <meta property="fc:frame:button:1:target" content="${postUrl}" />
    //       ${videoMeta}

    response = new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Success!</title>
          <meta property="og:title" content="You signed up to allowlist!" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
        </head>
        <body />
      </html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html'
        }
      }
    )
  } else {
    // const openseaChain = chain === 'eth' ? 'ethereum' : chain

    // const imageUrl = `${process.env.HOST}/api/images/no-pass/${id}`
    // const collectionLink = tokenId
    //   ? `https://opensea.io/assets/${openseaChain}/${address}/${tokenId}`
    //   : `https://opensea.io/assets/${openseaChain}/${address}`

    const imageUrl = `${process.env.HOST}/allowlist-no-nft.jpg`

    // <meta property="fc:frame:button:1" content="See Collection" />
    // <meta property="fc:frame:button:1:action" content="link" />
    // <meta property="fc:frame:button:1:target" content="${collectionLink}" />

    response = new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Oops, no access!</title>
          <meta property="og:title" content="Access haven't been granted to you." />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
        </head>
        <body />
      </html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html'
        }
      }
    )
  }

  // response.headers.set('Cache-Control', 'max-age=900, stale-while-revalidate')

  return response
}

export const GET = POST
