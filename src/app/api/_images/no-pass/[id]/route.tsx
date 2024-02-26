import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import { join } from 'path'
import * as fs from 'fs'
import Redis from 'ioredis'
import { VideoShareData } from '@/utils/types'

const unboundedBlackPath = join(process.cwd(), 'public/Unbounded-Black.ttf')
let unboundedBlack = fs.readFileSync(unboundedBlackPath)

const redisClient = new Redis(process.env.REDIS_URL!)

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id

  const dataString = await redisClient.get(id)

  if (!dataString) {
    return new NextResponse('Not found', { status: 404 })
  }

  const data = JSON.parse(dataString) as VideoShareData

  const requirementDescription = data.requirementDescription

  const response = new ImageResponse(
    (
      <div
        style={{
          display: 'flex', // Use flex layout
          flexDirection: 'row', // Align items horizontally
          alignItems: 'stretch', // Stretch items to fill the container height
          width: '100%',
          height: '100vh', // Full viewport height
          backgroundImage: 'linear-gradient(280deg, #97E6BA 0%, #FFFFFF 70%)'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingLeft: 52,
            paddingRight: 52,
            flex: 1,
            marginTop: 52,
            width: '100%'
          }}
        >
          <p
            style={{
              color: '#4BA568',
              fontSize: 110,
              display: 'flex',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: 0.95
            }}
          >
            You do not qualify the requirements :(
          </p>
          <p
            style={{
              color: '#000000',
              fontSize: 72,
              marginTop: 72,
              marginBottom: 12,
              marginRight: 369,
              display: 'flex',
              opacity: 0.5,
              lineHeight: 0.95
            }}
          >
            {requirementDescription}
          </p>
        </div>
        {/* <svg
          width="207"
          height="267"
          viewBox="0 0 207 267"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute "
          style={{
            position: 'absolute',
            bottom: 72,
            right: 72
          }}
        >
          <path
            d="M193.595 109.047C210.422 121.007 210.422 145.993 193.595 157.953L48.1295 261.34C28.2664 275.457 0.75 261.255 0.75 236.887L0.75 30.1135C0.75 5.74462 28.2665 -8.45691 48.1295 5.6604L193.595 109.047Z"
            fill="#4BA568"
          />
        </svg> */}
      </div>
    ),
    {
      width: 1528,
      height: 800,
      fonts: [
        {
          name: 'Unbounded',
          data: unboundedBlack,
          weight: 900,
          style: 'normal'
        }
      ]
    }
  )

  //   response.headers.set('Cache-Control', 'max-age=900, stale-while-revalidate')

  return response
}
