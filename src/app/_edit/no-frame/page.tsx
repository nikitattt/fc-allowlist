import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col text-center p-8 lg:p-16 mb-20">
      <div className="flex flex-col">
        <p className="font-black text-green-400">No frame found</p>
        <p className="mt-12 max-w-lg mx-auto">
          Couldn't find your frame. Try again.
        </p>
        <Link href="/edit">
          <div className="px-4 py-2 mt-4 w-max mx-auto bg-gray-900 rounded-lg">
            <p className="font-mono text-green-500">Try Again</p>
          </div>
        </Link>
      </div>
    </main>
  )
}
