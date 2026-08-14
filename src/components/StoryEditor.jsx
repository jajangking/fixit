import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function StoryEditor({ db }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle || !trimmedBody) {
      setStatus({ type: 'error', message: 'Judul dan isi tidak boleh kosong.' });
      return;
    }

    setSaving(true);
    setStatus({ type: 'loading', message: 'Menyimpan...' });

    try {
      await addDoc(collection(db, 'posts'), {
        title: trimmedTitle,
        body: trimmedBody,
        createdAt: serverTimestamp(),
      });
      setTitle('');
      setBody('');
      setStatus({ type: 'success', message: 'Cerita berhasil disimpan!' });
    } catch (err) {
      console.error(err);
      setStatus({
        type: 'error',
        message: 'Gagal menyimpan: ' + (err?.message ?? 'kesalahan tidak diketahui'),
      });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 4000);
    }
  };

  return (
    <form className="editor" onSubmit={handleSubmit}>
      <label className="field-label" htmlFor="story-title">
        <span className="prompt">$</span> title / judul
      </label>
      <input
        id="story-title"
        type="text"
        placeholder="contoh: gagal install opencode di termux"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={200}
      />

      <label className="field-label" htmlFor="story-body">
        <span className="prompt">$</span> body / isi cerita
      </label>
      <textarea
        id="story-body"
        placeholder="tulis keresahanmu di sini... apa yang kamu coba, gagalnya di mana, sampai akhirnya berhasil. seperti menulis status, tapi cerita panjang lebar."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <div className="editor-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'menyimpan...' : 'simpan cerita'}
        </button>
        {status.message && (
          <span className={`status ${status.type}`}>{status.message}</span>
        )}
      </div>
    </form>
  );
}
