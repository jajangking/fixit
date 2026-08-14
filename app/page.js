import StoryApp from '@/components/StoryApp';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-window">
            <div className="term-bar">
              <div className="term-dots" aria-hidden="true">
                <span className="term-dot red"></span>
                <span className="term-dot yellow"></span>
                <span className="term-dot green"></span>
              </div>
              <span className="term-title">
                <span className="prompt">$</span> fixit
              </span>
              <nav className="site-nav" aria-hidden="true">
                <a href="#tulis">write</a>
              </nav>
            </div>
            <div className="hero-body">
              <div className="line">
                <span className="dim"># blog pribadi — tempat curhat &amp; perjuangan</span>
              </div>
              <div className="line">
                <span className="amber">[ERR]</span> gagal.{' '}
                <span className="amber">[ERR]</span> gagal.{' '}
                <span className="amber">[ERR]</span> gagal.
              </div>
              <div className="line">
                <span className="amber">[WARN]</span> tapi aku tidak berhenti mencoba.
              </div>
              <div className="line">
                <span className="ok">[ OK ]</span> akhirnya berhasil.
              </div>
              <div className="line">
                <span className="dim">--- masalah apa pun, pasti ada jalannya ---</span>
              </div>
              <div className="line">
                <span className="cmd">
                  <span className="prompt">$</span> <span className="blink"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tulis" className="section">
        <div className="container">
          <div className="section-head">
            <span className="prompt">$</span>
            <span className="name">write / tulis ceritamu</span>
            <span className="hash">#</span>
          </div>
          <StoryApp />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="prompt">$</span>
            <span className="name">template / kerangka cerita</span>
            <span className="hash">#</span>
          </div>
          <div className="outline-box">
            <div className="line">
              <span className="dim"># kerangka cerita pertama</span>
            </div>
            <ol>
              <li>
                <strong>pendahuluan</strong> — kenapa masalah ini muncul / kenapa kamu bertahan
              </li>
              <li>
                <strong>kronologi kegagalan</strong> — apa saja yang kamu coba tapi gagal
              </li>
              <li>
                <strong>titik balik</strong> — momen ketika menemukan cara yang benar
              </li>
              <li>
                <strong>langkah detail</strong> — cara yang akhirnya berhasil, step by step
              </li>
              <li>
                <strong>penutup</strong> — pesan untuk pembaca yang mengalami hal serupa
              </li>
            </ol>
            <p className="hint">
              tips: tulis apa adanya seperti curhat, lalu rapikan. setiap entri
              tersimpan di firebase, jadi aman dan bisa diakses dari mana saja.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
