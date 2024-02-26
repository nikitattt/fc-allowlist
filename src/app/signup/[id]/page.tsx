import { Metadata } from 'next'
import Link from 'next/link'

export async function generateMetadata({
  params
}: {
  params: { id: string }
}): Promise<Metadata> {
  const id = params.id

  const imageUrl = `${process.env.HOST}/allowlist-${id}.jpg`
  const postUrl = `${process.env.HOST}/api/signup/${id}`

  return {
    metadataBase: new URL(process.env.HOST!),
    title: 'Allowlist',
    description: 'Sign Up to allowlist',
    openGraph: {
      title: 'Allowlist',
      images: [imageUrl]
    },
    other: {
      'fc:frame': 'vNext',
      'fc:frame:image': imageUrl,
      'fc:frame:post_url': postUrl,
      'fc:frame:button:1': 'Check eligibility and sign up'
    }
  }
}

export default function Home({ params }: { params: { id: string } }) {
  return (
    <main className="flex flex-col text-center p-8 lg:p-16">
      <div className="flex flex-col">
        <p className="font-black text-purple-400">Farcaster Frame</p>
        <h1 className="mt-12 lg:mt-16 text-6xl font-bold">
          Sign up to allowlist
        </h1>
        <div className="mt-12">
          <p className="max-w-lg mx-auto">{params.id}</p>
        </div>
        {/* <Link href="/" className="mt-20 text-green-500 underline">
          Make for my video
        </Link> */}
        <div className="mt-12">
          <p>
            Access:{' '}
            <a
              href="https://warpcast.com/iamng"
              className="text-purple-400 underline"
            >
              @iamng
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
