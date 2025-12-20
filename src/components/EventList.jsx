import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ChevronUp, UtensilsCrossed } from 'lucide-react';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showFoodOnly, setShowFoodOnly] = useState(false);

  useEffect(() => {
    const unsubscribe = db.collection('events').orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsData);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div className={`
      absolute bottom-0 left-0 right-0
      transition-all duration-500 ease-in-out
      ${isOpen ? 'h-[60vh] sm:h-3/4' : 'h-16 sm:h-20'}
      bg-slate-800/60 backdrop-blur-md 
      rounded-t-2xl shadow-lg border-t border-slate-700
    `}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer h-8 flex justify-center items-center">
        <ChevronUp className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      <div className="overflow-y-auto h-[calc(100%-2rem)] p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{showFoodOnly ? 'Events with Food 🍕' : 'Upcoming Events'}</h2>
          <button
            onClick={() => setShowFoodOnly(!showFoodOnly)}
            className={`p-2 rounded-lg transition-all ${showFoodOnly ? 'bg-yellow-400 text-black' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
            title="Show food events only"
          >
            <UtensilsCrossed size={18} />
          </button>
        </div>
        {events.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No events yet. Add one above!</p>
        ) : (
          <ul>
            {events.filter(e => !showFoodOnly || e.hasFood).map(event => (
              <li key={event.id} className="mb-4 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <p className="text-sm text-slate-400">{event.category} @ {event.locationId.replace(/_/g, ' ')}</p>
                    <p className="text-slate-300 mt-1 text-sm">{event.description}</p>
                    {event.time && <p className="text-xs text-slate-500 mt-1">⏰ {event.time}</p>}
                  </div>
                  {event.hasFood && (
                    <span className="ml-2 px-2 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full whitespace-nowrap">
                      🍕 FOOD
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventList;
