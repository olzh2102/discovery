import { useState } from 'react'

import checkIcon from '/images/check.svg'
import copyIcon from '/images/copy.svg'

export default function CodeBlock({
  children,
  path,
}: {
  children: React.ReactNode
  path?: string
}) {
  const [copied, setCopied] = useState(false)

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  return (
    <figure className="relative group max-md:w-[calc(100vw-2rem)] my-4 text-sm leading-4 bg-[#302749] shadow rounded border border-[#43316a]">
      {path && (
        <figcaption className="text-white font-medium">
          <span className="inline-block bg-[#523e7e] px-4 py-2">{path}</span>
        </figcaption>
      )}
      <button
        className={`
          border border-zinc-500 rounded p-1
          opacity-0 group-hover:opacity-100 hover:bg-[#523e7e]/60 duration-300 transition ease-in-out
          absolute right-2 ${path ? 'top-10' : 'top-2'}
        `}
        onClick={async (e) => {
          const text = e.currentTarget.nextElementSibling?.querySelector('code')?.innerText
          if (text) await copyText(text)
        }}
      >
        {copied ? <img src={checkIcon} alt="copied" /> : <img src={copyIcon} alt="copy" />}
      </button>
      {children}
    </figure>
  )
}
