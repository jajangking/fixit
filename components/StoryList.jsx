'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';

function formatDate(value) {
  if (!value) return '';
  const date = value.toDate ? value.toDate() : new Date(value);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function StoryList({ db }) {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPosts(items);
        setError('');
      },
      (err) => {
        console.error(err);
        setError(
          'Gagal membaca cerita: ' +
            (err?.message ?? 'periksa Firestore rules di README')
        );
      }
    );
    return () => unsubscribe();
  }, [db]);

  if (error) {
    return (
      <div className="empty-state">
        <p className="prompt">$ [ERR] gagal baca cerita</p>
        <p className="dim">{error}</p>
      </div>
    );
  }

  if (posts === null) {
    return (
      <div className="empty-state">
        <p className="prompt">$ loading cerita...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <p className="prompt">$ ls cerita/</p>
        <p className="dim">belum ada cerita. jadilah yang pertama menuliskan perjuanganmu.</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus cerita ini?')) return;
    try {
      await deleteDoc(doc(db, 'posts', id));
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus: ' + (err?.message ?? 'kesalahan tidak diketahui'));
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div className="section-head">
        <span className="prompt">$</span>
        <span className="name">timeline / daftar cerita</span>
        <span className="hash">#</span>
      </div>
      {posts.map((post) => (
        <article key={post.id} className="post-card">
          <h3 className="post-title">{post.title}</h3>
          <p className="post-date">{formatDate(post.createdAt)}</p>
          <p className="post-body">{post.body}</p>
          <div className="post-actions">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => handleDelete(post.id)}
            >
              hapus
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
