import { Metadata } from 'next'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col text-center p-8 lg:p-16">
      <div className="flex flex-col">
        <p className="font-black text-purple-400">Farcaster Frame</p>
        <h1 className="mt-12 lg:mt-16 text-6xl font-bold">Allowlist Frame</h1>
        <p className="mt-12 max-w-lg mx-auto">
          Make allowlist frame for your launch.
        </p>
        {/* <div className="mt-12">
          <p className="max-w-lg mx-auto">Get started:</p>
          <Link href="/create">
            <div className="px-4 py-2 mt-4 w-max mx-auto bg-gray-900 rounded-lg">
              <p className="font-mono text-green-500">Create new frame</p>
            </div>
          </Link>
          <Link href="/edit">
            <div className="px-4 py-2 mt-4 w-max mx-auto bg-gray-900 rounded-lg">
              <p className="font-mono text-green-500">Edit existing</p>
            </div>
          </Link>
        </div> */}
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
