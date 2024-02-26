import { VideoShareData } from '@/utils/types'
import dayjs from 'dayjs'
import Redis from 'ioredis'
import Image from 'next/image'
import { redirect } from 'next/navigation'

export default async function Home({ params }: { params: { id: string } }) {
  const updateFrame = async (formData: FormData) => {
    'use server'

    const redisClient = new Redis(process.env.REDIS_URL!)

    const editId = formData.get('editId')!.toString()
    const shareId = formData.get('shareId')!.toString()
    const title = formData.get('title')!.toString()
    const requirementDescription = formData
      .get('requirementDescription')!
      .toString()
    const requirement = formData.get('requirement')!.toString()
    const ownerFid = Number(formData.get('ownerFid')!.toString())
    const playbackId = formData.get('playbackId')!.toString()

    const dataToStore: VideoShareData = {
      title: title,
      requirementDescription: requirementDescription,
      requirement: requirement,
      ownerFid: ownerFid,
      playbackId: playbackId,
      shareId: shareId,
      editId: editId,
      lastUpdatedAt: dayjs().toISOString()
    }

    await redisClient.set(shareId, JSON.stringify(dataToStore))

    redirect(`/create/${shareId}_${editId}`)
  }

  const ids = params.id.split('_')
  const shareId = ids[0]
  const editId = ids[1]

  const redisClient = new Redis(process.env.REDIS_URL!)

  const dataString = await redisClient.get(shareId)

  if (!dataString) {
    throw Error('Frame data not found')
  }

  const data = JSON.parse(dataString) as VideoShareData

  return (
    <main className="flex flex-col text-center p-8 lg:p-16 mb-20">
      <div className="flex flex-col">
        <p className="font-black text-green-400">Update frame</p>
      </div>
      <Image
        width={1146}
        height={929}
        src="/desc.png"
        alt="what is what in frame"
        className="mt-12 lg:max-w-md mx-auto"
      />
      <form
        action={updateFrame}
        method="POST"
        className="mt-12 flex flex-col gap-6 mx-auto text-green-500 w-full max-w-md"
      >
        <input type="hidden" name="editId" value={editId} />
        <input type="hidden" name="shareId" value={shareId} />
        <div className="w-full">
          <input
            required
            defaultValue={data.title}
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
            defaultValue={data.requirementDescription}
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
            defaultValue={data.requirement}
            type="text"
            name="requirement"
            placeholder="Chain:Address:Optional Token Id"
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
            defaultValue={data.ownerFid}
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
            defaultValue={data.playbackId}
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
            defaultValue={data.playbackUrl}
            type="text"
            name="playbackUrl"
            placeholder="Playback URL"
            className="bg-gray-900 rounded-lg px-4 py-2 w-full outline-green-500"
          />
          <p className="mt-1 text-start text-sm text-white font-mono">
            (Optional) Playback URL of your video/stream. This allows video to
            start playing in the frame if supported
          </p>
        </div>
        <button
          type="submit"
          className="bg-green-500/20 rounded-lg px-4 py-2 w-full max-w-lg font-bold"
        >
          Update Frame
        </button>
      </form>
    </main>
  )
}
