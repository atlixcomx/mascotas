export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Centro de Adopción Atlixco</h1>
      <p>Si puedes ver esto, la aplicación está funcionando.</p>
      <div style={{ marginTop: '20px' }}>
        <a href="/perritos" style={{ marginRight: '10px', color: 'blue' }}>Ver Perritos</a>
        <a href="/admin" style={{ color: 'blue' }}>Admin</a>
      </div>
    </div>
  )
}