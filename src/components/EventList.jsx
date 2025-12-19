import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ChevronUp, UtensilsCrossed } from 'lucide-react';
import MapComponent from './MapComponent';
const EventList = () => {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showFoodOnly, setShowFoodOnly] = useState(false);
  const [eventsWithFood, setEventsWithFood] = useState([]);
  const [selected, setSelected] = useState("upcoming");
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const mapping={"upcoming":upcomingEvents,"ongoing":ongoingEvents,"past":pastEvents,"food":eventsWithFood};
  useEffect(() => {
    const now = new Date(); 
    const unsubscribe = db.collection('events').where('start_time', '>=', now).orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUpcomingEvents(eventsData);
        const food = eventsData.filter((event) => {
          return event.hasFood;
        });
        setEventsWithFood(food);
      });
    const unsubscribeOngoing=db.collection('events').where('end_time','>=',now).orderBy('timestamp','desc')
      .onSnapshot(snapshot=>{
        const eventsData=snapshot.docs.map(doc=>({id:doc.id,...doc.data()}));
        const ongoing=eventsData.filter((event)=>{
          return event.start_time?.toDate() < now;
        });
        setOngoingEvents(ongoing);
      })
    const unsubscribePast=db.collection('events').where('end_time','<',now).orderBy('timestamp','desc')
      .onSnapshot(snapshot=>{
        const eventsData=snapshot.docs.map(doc=>({id:doc.id,...doc.data()}));

        setPastEvents(eventsData);
      })  
    return () => {
      unsubscribe();
      unsubscribeOngoing();
      unsubscribePast();
    };

  }, []);

  return (
    <>
      <MapComponent events={mapping[selected]} />
      <div
        className={`
      absolute bottom-0 left-0 right-0
      transition-all duration-500 ease-in-out
      ${isOpen ? "h-3/4" : "h-20"}
      bg-slate-800/60 backdrop-blur-md 
      rounded-t-2xl shadow-lg border-t border-slate-700
    `}
      >
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer h-8 flex justify-center items-center"
        >
          <ChevronUp
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
        <div className="overflow-y-auto h-[calc(100%-2rem)] p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {selected === "upcoming"
                ? "Upcoming Events"
                : selected === "ongoing"
                ? "Ongoing Events"
                : selected === "past"
                ? "Past Events"
                : "Events with Food 🍕"}
            </h2>
            <select
              className="p-2 rounded-lg bg-gray-700 text-white 
             focus:outline-none focus:ring-2 focus:ring-blue-500 
             hover:bg-gray-600 transition-colors"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="upcoming" className="bg-gray-700 text-white">
                Upcoming Events
              </option>
              <option value="ongoing" className="bg-gray-700 text-white">
                Ongoing Events
              </option>
              <option value="food" className="bg-gray-700 text-white">
                Events with Food
              </option>
              <option value="past" className="bg-gray-700 text-white">
                Past Events
              </option>
            </select>
          </div>
          {mapping[selected].length === 0 ? (
            <p className="text-slate-400 text-center py-4">
              No {selected} events yet.
            </p>
          ) : (
            <ul>
              {mapping[selected].map((event) => (
                <li
                  key={event.id}
                  className="mb-4 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <p className="text-sm text-slate-400">
                        {event.category} @ {event.locationId.replace(/_/g, " ")}
                      </p>
                      <p className="text-slate-300 mt-1 text-sm">
                        {event.description}
                      </p>
                      {event.start_time && (
                        <p className="text-xs text-white mt-1">
                          ⏰ {"on "}
                          {event.start_time
                            .toDate()
                            .toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          {" from "}
                          {event.start_time.toDate().toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true, // ensures AM/PM format
                          })}
                          {" onwards"}
                        </p>
                      )}
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
    </>
  );
};

export default EventList;
