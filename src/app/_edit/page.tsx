import Redis from 'ioredis'
import { redirect } from 'next/navigation'

export default function Home() {
  const editFrame = async (formData: FormData) => {
    'use server'

    const redisClient = new Redis(process.env.REDIS_URL!)

    const editId = formData.get('editId')!.toString()

    const shareId = await redisClient.hget('editIdToShareId', editId)

    if (shareId) {
      const hasFrame = await redisClient.exists(shareId)
      if (hasFrame) {
        redirect(`/edit/${shareId}_${editId}`)
      } else {
        redirect('/edit/no-frame')
      }
    } else {
      redirect('/edit/no-frame')
    }
  }

  return (
    <main className="flex flex-col text-center p-8 lg:p-16 mb-20">
      <div className="flex flex-col">
        <p className="font-black text-green-400">Edit frame</p>
        <p className="mt-12 max-w-lg mx-auto">
          Edit your token-gated frame data.
        </p>
      </div>
      <form
        action={editFrame}
        method="POST"
        className="mt-12 flex flex-col gap-6 mx-auto text-green-500 w-full max-w-md"
      >
        <div className="w-full">
          <input
            required
            type="text"
            name="editId"
            placeholder="Your frame key for editing"
            maxLength={8}
            className="bg-gray-900 rounded-lg px-4 py-2 w-full outline-green-500"
          />
          <p className="mt-1 text-start text-sm text-white font-mono">
            Key looking like this:{' '}
            <span className="text-red-500">3310afc7</span>.
          </p>
        </div>
        <button
          type="submit"
          className="bg-green-500/20 rounded-lg px-4 py-2 w-full max-w-lg font-bold"
        >
          Edit Frame
        </button>
      </form>
    </main>
  )
}
