import Redis from 'ioredis'
import { VideoShareData } from '@/utils/types'
import { v4 as uuidv4 } from 'uuid'
import { randomBytes } from 'crypto'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import dayjs from 'dayjs'

export default function Home() {
  const createFrame = async (formData: FormData) => {
    'use server'

    const redisClient = new Redis(process.env.REDIS_URL!)

    const shareId = uuidv4()
    const editId = randomBytes(4).toString('hex').slice(0, 8)

    const title = formData.get('title')!.toString()
    const requirementDescription = formData
      .get('requirementDescription')!
      .toString()
    const requirement = formData.get('requirement')!.toString()
    const ownerFid = Number(formData.get('ownerFid')!.toString())
    const playbackId = formData.get('playbackId')!.toString()
    const playbackUrl = formData.get('playbackUrl')?.toString()

    const dataToStore: VideoShareData = {
      title: title,
      requirementDescription: requirementDescription,
      requirement: requirement,
      ownerFid: ownerFid,
      playbackId: playbackId,
      playbackUrl: playbackUrl,
      shareId: shareId,
      editId: editId,
      createdAt: dayjs().toISOString(),
      lastUpdatedAt: dayjs().toISOString()
    }

    await redisClient.set(shareId, JSON.stringify(dataToStore))
    await redisClient.hset('editIdToShareId', editId, shareId)
    await redisClient.hset('editIdToFid', ownerFid, shareId)

    redirect(`/create/${shareId}_${editId}`)
  }

  return (
    <main className="flex flex-col text-center p-8 lg:p-16 mb-20">
      <div className="flex flex-col">
        <p className="font-black text-green-400">Create token gated frame</p>
        <p className="mt-12 max-w-lg mx-auto">
          Please provide following data, so we can create a frame for you:
        </p>
      </div>
      <Image
        width={1146}
        height={929}
        src="/desc.png"
        alt="what is what in frame"
        className="mt-12 lg:max-w-md mx-auto"
      />
      <form
        action={createFrame}
        method="POST"
        className="mt-12 flex flex-col gap-6 mx-auto text-green-500 w-full max-w-md"
      >
        <div className="w-full">
          <input
            required
            type="text"
            name="title"
            placeholder="Title"
            maxLength={60}
            className="bg-gray-900 rounded-lg px-4 py-2 w-full outline-green-500"
          />
          <p className="mt-1 text-start text-sm text-white font-mono">
            Max 60 characters
          </p>
        </div>
        <div className="w-full">
          <input
            required
            type="text"
            name="requirementDescription"
            placeholder="Requirements Description"
            maxLength={50}
            className="bg-gray-900 rounded-lg px-4 py-2 w-full outline-green-500"
          />
          <p className="mt-1 text-start text-sm text-white font-mono">
            Max 50 characters
          </p>
        </div>
        <div className="w-full">
          <input
            required
            type="text"
            name="requirement"
            placeholder="chain:address:token(optional)"
            maxLength={50}
            className="bg-gray-900 rounded-lg px-4 py-2 w-full outline-green-500"
          />
          <p className="mt-1 text-start text-sm text-white font-mono">
            Chain + ERC720 or ERC1155 contract address + optional token id used
            to token gate
            <br />
            If ERC720 provide only chain:address, like this:{' '}
            <span className="text-red-500">base:0x66...e468</span>.
            <br />
            If ERC1155 provide chain:address:id, like this:{' '}
            <span className="text-red-500">eth:0x66...e468:3</span>.
            <br />
            Supported chains: <span className="text-red-500">eth</span>,{' '}
            <span className="text-red-500">base</span>,{' '}
            <span className="text-red-500">optimism</span>.
          </p>
        </div>
        <div className="w-full">
          <input
            required
            type="text"
            name="ownerFid"
            placeholder="Your Farcaster FID"
            maxLength={50}
            className="bg-gray-900 rounded-lg px-4 py-2 w-full outline-green-500"
          />
          <p className="mt-1 text-start text-sm text-white font-mono">
            We use to restore access to your frame
          </p>
        </div>
        <div className="w-full">
          <input
            required
            type="text"
            name="playbackId"
            placeholder="Playback ID"
            maxLength={50}
            className="bg-gray-900 rounded-lg px-4 py-2 w-full outline-green-500"
          />
          <p className="mt-1 text-start text-sm text-white font-mono">
            Playback ID of your video/stream
          </p>
        </div>
        <div className="w-full">
          <input
            type="text"
            name="playbackUrl"
            placeholder="Playback URL"
            className="bg-gray-900 rounded-lg px-4 py-2 w-full outline-green-500"
          />
          <p className="mt-1 text-start text-sm text-white font-mono">
            (Optional) Playback URL of your video/stream. This allows video to
            start playing in the frame, if supported by the farcaster client.
          </p>
        </div>
        <button
          type="submit"
          className="bg-green-500/20 rounded-lg px-4 py-2 w-full max-w-lg font-bold"
        >
          Create token gated frame
        </button>
      </form>
    </main>
  )
}
