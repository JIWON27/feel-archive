export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--primary-color)' }}>
          Feel-Archive
        </h1>
        <p className="text-lg text-gray-600">
          공간 기반 감정 아카이빙 플랫폼
        </p>
      </div>
    </main>
  );
}
