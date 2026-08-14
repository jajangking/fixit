import './globals.css';

export const metadata = {
  title: 'fixit — blog perjuangan',
  description:
    'Blog pribadi: tulis cerita perjuanganmu, dari kegagalan hingga berhasil.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#0b0e11" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <header className="site-header">
          <div className="term-bar">
            <div className="term-dots" aria-hidden="true">
              <span className="term-dot red"></span>
              <span className="term-dot yellow"></span>
              <span className="term-dot green"></span>
            </div>
            <span className="term-title">
              <span className="prompt">$</span> fixit — diary // termux
            </span>
            <nav className="site-nav">
              <a href="/">home</a>
              <a href="#tulis">write</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <div className="line">
              <span className="prompt">$</span> echo &quot;exit code: success&quot;
            </div>
            <div className="line">
              <span className="ok">exit code: 0</span>{' '}
              <span className="dim">// ketekunan &gt; talenta</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
