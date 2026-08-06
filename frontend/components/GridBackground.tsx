/*
  components/GridBackground.tsx
  Light mode version — subtle warm dot grid + soft blue top glow.
*/

export default function GridBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      {/* Subtle dot grid */}
      <div className="absolute inset-0 dot-grid opacity-60" />

      {/* Soft top blue glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(ellipse, rgba(26,115,232,0.06), transparent 70%)' }}
      />

      {/* Bottom right soft green tint */}
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(ellipse, rgba(30,142,62,0.04), transparent 70%)' }}
      />
    </div>
  )
}