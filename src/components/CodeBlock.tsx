export default function CodeBlock({
  children,
  path,
}: {
  children: React.ReactNode
  path?: string
}) {
  return (
    <figure className="relative group my-3 text-sm leading-4 bg-[#302749] rounded border border-[#a27afa] overflow-hidden">
      {path && (
        <figcaption className="text-white">
          <span className="inline-block bg-[#523e7e] px-4 py-2">{path}</span>
        </figcaption>
      )}
      {children}
    </figure>
  )
}
