import { doc, deleteDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';

export async function deleteOldCancellations() {
  console.log('Cleaning up old test cancellations...');
  try {
    const oldRecords = ['wMCaw37zUuVuGuwpkc2y', 'yNRTo3EPJQt10EuPPO1z'];
    
    for (const bookingId of oldRecords) {
      // Find the cancellation request by bookingId
      const q = query(collection(db, COLLECTIONS.cancellationRequests), where('bookingId', '==', bookingId));
      const snap = await getDocs(q);
      
      snap.forEach(async (d) => {
        await deleteDoc(doc(db, COLLECTIONS.cancellationRequests, d.id));
      });
      
      // Delete the booking itself
      await deleteDoc(doc(db, COLLECTIONS.bookings, bookingId));
    }
    
    console.log('Successfully deleted the old test data!');
  } catch (error) {
    console.error('Error deleting records:', error);
  }
}
