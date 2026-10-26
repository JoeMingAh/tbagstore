// CAD blueprint line drawings from Joe's design, one per product (keyed by product.key).
const LABEL = 'fill-gold font-mono text-[10px]'

function Frame({ children, title }) {
  return (
    <svg viewBox="0 0 400 280" className="h-full w-full fill-none stroke-gold" strokeWidth="1.5" role="img" aria-label={title}>
      <rect x="20" y="20" width="360" height="240" rx="8" strokeDasharray="4 4" strokeOpacity="0.4" />
      {children}
    </svg>
  )
}

function Label({ x = 200, y, children, className = LABEL }) {
  return (
    <text x={x} y={y} textAnchor="middle" className={className} stroke="none">
      {children}
    </text>
  )
}

const DRAWINGS = {
  'first-tee-sack': (
    <>
      <path d="M145 75 C130 120, 120 185, 140 215 C160 235, 240 235, 260 215 C280 185, 270 120, 255 75 Z" strokeWidth="2" />
      <path d="M140 85 L260 85" strokeDasharray="3 3" />
      <circle cx="200" cy="50" r="16" strokeWidth="2" />
      <path d="M125 95 C100 110, 105 140, 130 145" />
      <path d="M275 95 C300 110, 295 140, 270 145" />
      <Label y={160} className="fill-gold font-mono text-[11px]">
        TUSCAN BRIDLE HIDE
      </Label>
      <Label y={178} className="fill-gold/70 font-mono text-[9px]">
        TOLERANCE: ±0.2MM STITCH PITCH
      </Label>
    </>
  ),
  'heavy-hitter': (
    <>
      <rect x="160" y="45" width="80" height="105" rx="22" strokeWidth="2" />
      <circle cx="200" cy="95" r="26" strokeWidth="2" />
      <circle cx="200" cy="95" r="20" strokeDasharray="2 2" />
      <path d="M168 150 L168 230 L185 210 L185 150" strokeWidth="2" />
      <path d="M232 150 L232 230 L215 210 L215 150" strokeWidth="2" />
      <Label x={310} y={98}>
        N52 DOCK
      </Label>
      <Label y={252}>C360 BILLET BRASS // 78G</Label>
    </>
  ),
  'clingy-caddie': (
    <>
      <rect x="115" y="45" width="170" height="190" rx="6" strokeWidth="2" />
      <rect x="175" y="60" width="50" height="35" rx="4" strokeWidth="2" />
      <circle cx="200" cy="77" r="9" className="fill-gold/30" />
      <line x1="115" y1="120" x2="285" y2="120" strokeDasharray="4 4" />
      <line x1="115" y1="160" x2="285" y2="160" strokeDasharray="4 4" />
      <line x1="115" y1="200" x2="285" y2="200" strokeDasharray="4 4" />
      <Label y={145}>650 GSM WAFFLE MATRIX</Label>
    </>
  ),
  'sandbaggers-stash': (
    <>
      <circle cx="110" cy="135" r="38" strokeWidth="2" />
      <circle cx="170" cy="135" r="38" strokeWidth="2" />
      <circle cx="230" cy="135" r="38" strokeWidth="2" />
      <circle cx="290" cy="135" r="38" strokeWidth="2" />
      <Label y={215}>4X 32MM MILLED SPECIMENS // 112G TOTAL</Label>
    </>
  ),
  'crown-jewel': (
    <>
      <rect x="115" y="55" width="170" height="150" rx="36" strokeWidth="2" />
      <rect x="127" y="67" width="146" height="126" rx="28" strokeDasharray="4 4" />
      <Label y={135} className="fill-gold font-mono text-[11px]">
        MERINO SHEARLING CORE
      </Label>
      <Label y={232}>SILENT DUAL MAGNETIC CLOSURE</Label>
    </>
  ),
  'yardage-alibi': (
    <>
      <rect x="135" y="45" width="130" height="185" rx="18" strokeWidth="2" />
      <path d="M135 90 Q200 130 265 90" strokeWidth="2" />
      <circle cx="200" cy="115" r="8" className="fill-gold" />
      <Label y={175}>WET-MOLDED HOLSTER</Label>
    </>
  ),
  'gentlemans-timber': (
    <>
      <path d="M175 55 L225 55 L208 80 L208 210 L200 235 L192 210 L192 80 Z" strokeWidth="2" />
      <line x1="192" y1="115" x2="208" y2="115" strokeWidth="4" />
      <line x1="192" y1="130" x2="208" y2="130" strokeWidth="2" />
      <Label y={255}>3.25&quot; TOUR SPEC + BRASS TUBE</Label>
    </>
  ),
  'back-nine-flask': (
    <>
      <rect x="130" y="65" width="140" height="165" rx="14" strokeWidth="2" />
      <rect x="180" y="42" width="40" height="23" rx="3" strokeWidth="2" />
      <line x1="130" y1="145" x2="270" y2="145" strokeDasharray="3 3" />
      <Label y={112}>GRADE-5 Ti 6OZ FLASK</Label>
      <Label y={190}>CHRONOGRAPH VALET</Label>
    </>
  ),
}

export default function Blueprint({ product }) {
  return <Frame title={`${product.name} CAD blueprint`}>{DRAWINGS[product.key]}</Frame>
}
