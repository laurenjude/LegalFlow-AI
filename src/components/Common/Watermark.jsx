export default function Watermark() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center px-5 py-2"
      style={{ background: 'rgba(15, 76, 58, 0.95)' }}
    >
      <p className="text-[12px] text-[#C9A961] text-center leading-snug">
        Built by Lauren Jude — AI Automation Engineer&nbsp;|&nbsp;
        <a
          href="https://laurens-potfolio.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:underline"
        >
          View Portfolio
        </a>
        &nbsp;|&nbsp;
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
