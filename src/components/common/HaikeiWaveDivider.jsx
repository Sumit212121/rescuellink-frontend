export default function HaikeiWaveDivider({
  variant = 'top',
  fillColor = '#faf8f5',
  gradient = null, // e.g. { from: '#fff1f2', to: '#faf8f5', id: 'wave-grad' }
  className = '',
  height = '52px',
  flip = false
}) {
  const gradientId = gradient?.id || `wave-grad-${Math.random().toString(36).slice(2, 7)}`

  return (
    <div
      className={`w-full overflow-hidden leading-none pointer-events-none select-none ${className}`}
      style={{ height, transform: flip ? 'scaleX(-1)' : 'none' }}
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-full"
      >
        {gradient && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradient.from} stopOpacity={gradient.fromOpacity ?? 1} />
              <stop offset="100%" stopColor={gradient.to} stopOpacity={gradient.toOpacity ?? 1} />
            </linearGradient>
          </defs>
        )}
        <path
          d={
            variant === 'top'
              ? 'M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z'
              : 'M0,0 L1200,0 L1200,45 C1050,110 850,15 700,80 C550,145 350,20 0,65 Z'
          }
          fill={gradient ? `url(#${gradientId})` : fillColor}
        />
      </svg>
    </div>
  )
}
