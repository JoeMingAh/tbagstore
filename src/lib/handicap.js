// Sandbagger Index from the design's handicap calibrator: the gap between the negotiated
// first-tee handicap and the official index picks a tier and a diagnosis. Copy is draft.
export function sandbaggerTier(official, negotiated) {
  const diff = Number((negotiated - official).toFixed(1))
  if (diff >= 8) {
    return {
      diff,
      tier: 'GRAND MASTER SANDBAGGER',
      diagnosis: `+${diff} Stroke Inflation — Banned from three Member-Guests, undefeated in cash games.`,
    }
  }
  if (diff >= 3.5) {
    return {
      diff,
      tier: 'CLUBHOUSE DIPLOMAT',
      diagnosis: `+${diff} Stroke Inflation — Master of the "My Back Locked Up on the Range" alibi.`,
    }
  }
  if (diff >= 0.5) {
    return {
      diff,
      tier: 'TACTICAL STROKE PROTECTOR',
      diagnosis: `+${diff} Stroke Cushion — Just enough padding to win the 18th hole carry-over.`,
    }
  }
  if (diff < 0) {
    return {
      diff,
      tier: 'VANITY HANDICAPPER',
      diagnosis: `${diff} Stroke Vanity — Your wallet is every Sandbagger's favorite target.`,
    }
  }
  return { diff, tier: 'TOUR HONESTY ANOMALY', diagnosis: 'You actually give strokes back? Bold strategy in a press game.' }
}
