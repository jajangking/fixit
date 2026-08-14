'use client';

import { useState } from 'react';
import { initFirebase, isFirebaseConfigured } from '@/lib/firebase';
import StoryEditor from './StoryEditor';
import StoryList from './StoryList';

export default function StoryApp() {
  const [db] = useState(() => (isFirebaseConfigured ? initFirebase() : null));

  if (!db) {
    return (
      <div className="empty-state">
        <p className="prompt">$ setup firebase first</p>
        <p className="dim">
          Salin <code>.env.example</code> menjadi <code>.env</code> lalu isi
          kredensial Firebase-mu. Detail langkahnya ada di <code>README.md</code>.
        </p>
      </div>
    );
  }

  return (
    <>
      <StoryEditor db={db} />
      <StoryList db={db} />
    </>
  );
}
