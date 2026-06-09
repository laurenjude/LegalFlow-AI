export default function Watermark() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center px-3 py-1.5 md:px-5 md:py-2"
      style={{ background: 'rgba(15, 76, 58, 0.95)' }}
    >
      <p className="text-[10px] md:text-[12px] text-[#C9A961] text-center leading-snug flex flex-wrap justify-center gap-x-1">
        <span>Built by Lauren Jude — AI Automation Engineer</span>
        <span className="text-[#C9A961]">|</span>
        <a
          href="https://laurens-potfolio.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:underline"
        >
          View Portfolio
        </a>
        <span className="text-[#C9A961]">|</span>
        <a
          href="mailto:laurenjude9@gmail.com"
          className="text-white hover:underline"
        >
          Contact for Collaboration or Licensing
        </a>
      </p>
    </div>
  )
}
