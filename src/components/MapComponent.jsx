import { useState, useEffect } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import BeaconMarker from './BeaconMarker';
import  { locationCoords } from './EventInput';

const MapComponent = ({events}) => {
  // const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const position = { lat: 13.01085, lng: 74.79250 };
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;
  // Bound the map to NITK Surathkal campus and beach area
  const mapBounds = {
    north: 13.0148,
    south: 13.005,
    east: 74.799,
    west: 74.785,
  };
  
  const mapStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
  ];

  // useEffect(() => {
  //   const date= new Date();
  //   const unsubscribe = db.collection('events').where('end_time','>=',date).orderBy('end_time', 'desc')
  //     .onSnapshot(snapshot => {
  //       const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //       setEvents(eventsData);
  //     });

  //   return () => unsubscribe();
  // }, []);

  const mapOptions = {
    restriction: { latLngBounds: mapBounds, strictBounds: true },
  };

  // When mapId is provided, styles must be set in Google Cloud console; avoid passing styles prop to suppress warning.
  const maybeStyles = mapId ? {} : { styles: mapStyles };

  return (
    <>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={position}
          defaultZoom={16}
          defaultTilt={60}
          defaultHeading={0}
          mapId={mapId}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          options={mapOptions}
          {...maybeStyles}
          onClick={() => setSelectedEvent(null)}
        >
          {events.map((event) => (
            <BeaconMarker
              key={event.id}
              event={event}
              isSelected={selectedEvent?.id === event.id}
              onSelect={() => setSelectedEvent(event)}
            />
          ))}
        </Map>

        {/* Event Detail Card */}
        {selectedEvent && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-11/12 md:w-96 max-w-md">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border-2 border-white/50 animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
              >
                ✕
              </button>

              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedEvent.hasFood
                      ? "bg-yellow-400 text-black"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {selectedEvent.hasFood ? "🍕" : "⚡"}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {selectedEvent.category}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-lg">📍</span>
                  <span className="font-medium">
                    {locationCoords[selectedEvent.locationId]?.name ||
                      selectedEvent.locationId.replace(/_/g, " ")}
                  </span>
                </div>

                {selectedEvent.start_time && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="text-lg">⏰</span>
                    <span>
                      {selectedEvent.start_time?.toDate().toLocaleString([], {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true, // optional: use 12‑hour format with AM/PM
                      })}
                    </span>
                  </div>
                )}

                {selectedEvent.hasFood && (
                  <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
                    <span className="text-lg">🍕</span>
                    <span className="font-bold">Free Food Available!</span>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-slate-600 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </APIProvider>
    </>
  );
};

export default MapComponent;
