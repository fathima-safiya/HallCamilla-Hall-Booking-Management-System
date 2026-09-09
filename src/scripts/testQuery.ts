import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';

async function run() {
  const maintQ = collection(db, COLLECTIONS.maintenances);
  const snap = await getDocs(maintQ);
  console.log('MAINTENANCES:', snap.docs.map(d => d.data()));
  process.exit(0);
}

run();
