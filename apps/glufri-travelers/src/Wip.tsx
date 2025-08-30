export default function Wip() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e2e8f0 0%, #f8fafc 100%)',
        color: '#1f2937',
        padding: 24,
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 640 }}>
        <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>
          GluFri Travelers
        </div>
        <div style={{ fontSize: 20, opacity: 0.9, marginBottom: 16 }}>Gluten Free, ovunque</div>
        <p style={{ fontSize: 16, opacity: 0.8, marginBottom: 8 }}>
          L'app per viaggiatori celiaci e gluten-sensitive: trova opzioni senza glutine ovunque ti
          trovi o stai andando.
        </p>
        <p style={{ fontSize: 16, opacity: 0.75 }}>
          Presto potrai scoprire locali e alloggi sicuri, leggere e lasciare recensioni, consultare
          mappe e itinerari GF e condividere esperienze con la community. Torna a trovarci: siamo al
          lavoro sul lancio.
        </p>
      </div>
    </div>
  )
}
