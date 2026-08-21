export default function OfflinePage() {
  return <main className="offline-page">
    <section>
      <span>結</span>
      <p className="eyebrow">OFFLINE</p>
      <h1>잠시 연결이<br/>끊어졌습니다.</h1>
      <p>인터넷 연결을 확인한 뒤 다시 시도해 주세요. 이 브라우저에 저장된 Journal 기록은 연결이 돌아오면 그대로 확인할 수 있습니다.</p>
      <a href="/">다시 연결하기 →</a>
    </section>
  </main>;
}
