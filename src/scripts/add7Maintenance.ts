import { collection, doc, writeBatch, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestorePaths';
import type { MaintenanceRecord, Hall } from '../types/app';

const addDemoData = async () => {
  try {
    const hallsSnapshot = await getDocs(collection(db, COLLECTIONS.halls));
    const halls = hallsSnapshot.docs.map(d => d.data() as Hall);
    
    if (halls.length === 0) {
      console.log('No halls found');
      return;
    }

    const batch = writeBatch(db);
    const maintenanceReasons = [
      'Annual Deep Cleaning',
      'Lighting System Upgrade',
      'HVAC Routine Check',
      'Carpet Replacement',
      'Wall Painting & Touchups',
      'Pest Control Service',
      'Audio Equipment Tuning'
    ];

    console.log('Adding 7 new demo maintenance records...');

    for (let i = 0; i < 7; i++) {
      const mainId = doc(collection(db, COLLECTIONS.maintenances)).id;
      const today = new Date();
      // Spread them across the next 3 months
      const startDaysOffset = Math.floor(Math.random() * 90) + 5; 
      
      const mDate = new Date(today.getTime() + startDaysOffset * 24 * 60 * 60 * 1000);
      const eDate = new Date(mDate.getTime() + (Math.floor(Math.random() * 4) + 1) * 24 * 60 * 60 * 1000); // 1 to 4 days length
      
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      
      const maintenance: MaintenanceRecord = {
        id: mainId,
        hallId: halls[i % halls.length].id,
        startDate: formatDate(mDate),
        endDate: formatDate(eDate),
        reason: maintenanceReasons[i],
        createdAt: new Date().toISOString()
      };
      
      batch.set(doc(db, COLLECTIONS.maintenances, mainId), maintenance);
    }
    
    await batch.commit();
    console.log('Successfully added 7 demo records!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding data:', error);
    process.exit(1);
  }
};

addDemoData();
