import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`
        relative bg-white shadow-2xl w-full flex flex-col
        rounded-t-2xl sm:rounded-xl
        max-h-[92vh] sm:max-h-[90vh]
        sm:${maxWidth}
      `}>
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-base md:text-lg font-semibold text-[#1A1A1A]">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none p-1"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-4 md:px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}
