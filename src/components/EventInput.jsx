import { useState } from 'react';
import { parseEvent } from '../utils/gemini';
import { db, auth, firebase } from '../firebase';

const locationCoords = {
  MAIN_BUILDING: { lat: 13.010909, lng: 74.794371, name: "Main Building" },
  LHC_A: { lat: 13.009500, lng: 74.793835, name: "LHC Block A" },
  LHC_B: { lat: 13.01120, lng: 74.79340, name: "LHC Block B" },
  LHC_C: { lat: 13.010464, lng: 74.792304, name: "LHC Block C" },
  CCC: { lat: 13.009468, lng: 74.795761, name: "CCC (Computer Center)" },
  DIGITAL_LIBRARY: { lat: 13.010036, lng: 74.794829, name: "Digital Library" },
  LIBRARY: { lat: 13.010036, lng: 74.794829, name: "Central Library" },
  SPORTS_COMPLEX: { lat: 13.010909, lng: 74.794371, name: "Old Sports Complex" },
  OSC: { lat: 13.010909, lng: 74.794371, name: "Old Sports Complex" },
  PAVILION: { lat: 13.011026, lng: 74.794657, name: "Pavilion Ground" },
  MAIN_GROUND: { lat: 13.010082, lng: 74.797159, name: "Main Ground" },
  NSC_AREA: { lat: 13.009977, lng: 74.798873, name: "New Sports Complex Area" },
  MEGA_TOWER: { lat: 13.01580, lng: 74.79720, name: "Mega Towers (Hostel)" },
  ATB: { lat: 13.00950, lng: 74.79450, name: "ATB Seminar Hall" },
  SJA: { lat: 13.008584, lng: 74.795712, name: "Silver Jubilee Auditorium" },
  GUEST_HOUSE: { lat: 13.00850, lng: 74.78950, name: "Guest House" },
  BEACH: { lat: 13.014117, lng: 74.788072, name: "NITK Beach" },
  LIGHTHOUSE: { lat: 13.004784, lng: 74.789705, name: "NITK Lighthouse" },
  UNKNOWN: { lat: 13.010909, lng: 74.794371, name: "Campus Location" },
};

// Export for use in other components
export { locationCoords };

const EventInput = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!text.trim()) return;
    if (!auth.currentUser) {
      setError('Please sign in to add events');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const eventData = await parseEvent(text);
      console.log('Parsed Event:', eventData);
      
      if (eventData && eventData.locationId && locationCoords[eventData.locationId]) {
        const newEvent = {
          ...eventData,
          coords: locationCoords[eventData.locationId],
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          createdBy: auth.currentUser.uid,
          createdAt: new Date().toISOString()
        };
        await db.collection('events').add(newEvent);
        setText('');
      } else {
        setError(`Location not found. Valid locations: DL, LHC, Beach, SJA, CCC, Main Building, Sports Complex, etc.`);
      }
    } catch (error) {
      console.error('Failed to parse and save event:', error);
      setError(error.message || 'Failed to add event. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[94%] max-w-xl md:w-1/3 p-3 md:p-4 bg-slate-800/60 backdrop-blur-md rounded-xl shadow-lg border border-slate-700">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={auth.currentUser ? "Paste event message: 'Hackathon at Digital Library with free pizza!'" : "Please sign in to add events"}
        className="w-full h-20 md:h-24 p-2 bg-transparent text-white placeholder-slate-400 rounded-lg resize-none focus:outline-none"
        disabled={loading || !auth.currentUser}
        onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleSubmit()}
      />
      <button
        onClick={handleSubmit}
        className="w-full mt-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors disabled:bg-gray-500"
        disabled={loading || !auth.currentUser}
      >
        {loading ? 'Analyzing...' : 'Add Event'}
      </button>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default EventInput;
