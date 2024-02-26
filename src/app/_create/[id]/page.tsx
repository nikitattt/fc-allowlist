export default function Home({ params }: { params: { id: string } }) {
  const ids = params.id.split('_')
  const shareId = ids[0]
  const editId = ids[1]

  return (
    <main className="flex flex-col text-center p-8 lg:p-16 mb-20">
      <div className="flex flex-col">
        <p className="font-black text-green-400">Your token gated frame</p>
        <p className="mt-12 max-w-lg mx-auto">Link to your frame:</p>
        <div className="px-4 py-2 mt-4 w-full lg:w-max mx-auto bg-gray-900 rounded-lg">
          <p className="font-mono text-green-500 break-all flex whitespace-pre-wrap">
            {process.env.HOST}/play/{shareId}
          </p>
        </div>
        <p className="mt-4 max-w-lg mx-auto">
          Share this link on Farcaster and only owners of specified NFT will be
          able to access your video.
        </p>
      </div>
      <div className="mt-12 flex flex-col">
        <p className="text-purple-400">One more thing</p>
        <p className="mt-2">Your key to edit created frame:</p>
        <div className="px-4 py-2 mt-4 w-max mx-auto bg-gray-900 rounded-lg">
          <p className="font-mono text-green-500">{editId}</p>
        </div>
        <p className="mt-4">Keep it safe, so you can later edit your frame.</p>
      </div>
    </main>
  )
}
