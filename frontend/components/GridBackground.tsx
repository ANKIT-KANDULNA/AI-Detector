/*
  components/GridBackground.tsx — purely decorative, server component.
  Creates the subtle grid + glow effect behind all pages.
*/

export default function GridBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `radial-gradient(circle, #4fc3f7 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Top center glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />

      {/* Bottom glow */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-real/5 rounded-full blur-[100px]" />
    </div>
  )
}
