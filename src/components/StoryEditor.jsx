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
      <label htmlFor="story-title">Judul</label>
      <input
        id="story-title"
        type="text"
        placeholder="Contoh: Gagal install OpenCode di Termux"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={200}
      />

      <label htmlFor="story-body">Isi Cerita</label>
      <textarea
        id="story-body"
        placeholder="Tulis keresahanmu di sini... apa yang kamu coba, gagalnya di mana, sampai akhirnya berhasil. Seperti menulis status di media sosial, tapi ini cerita panjang lebar."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <div className="editor-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan Cerita'}
        </button>
        {status.message && (
          <span className={`status ${status.type}`}>{status.message}</span>
        )}
      </div>
    </form>
  );
}
