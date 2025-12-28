import { useState,useEffect } from 'react';
import { ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

const EventList = ({ events = [], selected = 'upcoming', setSelected = () => {}, mapping = {},club,setClub = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const CLUBS = [
    "ALL",
    "IEEE",
    "IET",
    "ACM",
    "IE",
    "ISTE",
    "WEC",
    "ROBOCON",
    "GENESIS",
    "YOGA",
    "E-CELL",
    "MUSIC CLUB",
  ];
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden sm:block fixed left-4 top-20 bottom-4 w-80 z-20">
        <div className="h-full backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200/50">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {selected === "upcoming"
                ? "Upcoming Events"
                : selected === "ongoing"
                ? "Ongoing Events"
                : selected === "past"
                ? "Past Events"
                : "Events with Food 🍕"}
            </h2>
            <select
              className="w-full p-2 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-indigo-100 transition-colors text-sm"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="upcoming">Upcoming Events</option>
              <option value="ongoing">Ongoing Events</option>
              <option value="food">Events with Food</option>
              <option value="past">Past Events</option>
            </select>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Filter by Club
              </label>
              <select
                className="w-full p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:bg-amber-100 transition-colors text-sm"
                value={club}
                onChange={(e) => setClub(e.target.value)}
              >
                {CLUBS.map((club) => (
                  <option key={club} value={club}>
                    {club}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {events.length === 0 ? (
              <p className="text-slate-500 text-center py-4">
                No {selected} events yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {events.map((event) => {
                  const formatDateTime = (value) => {
                    if (!value) return "";
                    const d =
                      typeof value.toDate === "function"
                        ? value.toDate()
                        : value instanceof Date
                        ? value
                        : null;
                    if (!d) return "";
                    return d.toLocaleString([], {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                  };

                  return (
                    <li
                      key={event.id}
                      className="p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer border border-indigo-100"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-base text-slate-900">
                            {event.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1">
                            {event.category} @{" "}
                            {event.locationId.replace(/_/g, " ")}
                          </p>
                          {event.club && (
                            <p className="text-xs text-amber-700 font-medium mt-0.5">
                              🏛️ {event.club}
                            </p>
                          )}
                          <p className="text-slate-700 mt-1 text-sm">
                            {event.description}
                          </p>
                          {(event.start_time || event.end_time) && (
                            <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                              {event.start_time && (
                                <p>
                                  Starts: {formatDateTime(event.start_time)}
                                </p>
                              )}
                              {event.end_time && (
                                <p>Ends: {formatDateTime(event.end_time)}</p>
                              )}
                            </div>
                          )}
                        </div>
                        {event.hasFood && (
                          <span className="ml-2 px-2 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full whitespace-nowrap">
                            🍕
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Bottom Bar */}
      <div className="sm:hidden">
        <div
          className={`
          fixed bottom-0 left-0 right-0 z-20
          transition-all duration-500 ease-in-out
          ${isOpen ? "h-[70vh]" : "h-16"}
          backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80
          rounded-t-2xl shadow-lg border-t border-slate-200/50
        `}
        >
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer h-12 flex justify-center items-center"
          >
            <ChevronUp
              className={`transition-transform text-slate-700 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {isOpen && (
            <div className="h-[calc(100%-3rem)] overflow-hidden flex flex-col px-4 pb-4">
              <div className="mb-3">
                <h2 className="text-lg font-bold text-slate-900 mb-2">
                  {selected === "upcoming"
                    ? "Upcoming Events"
                    : selected === "ongoing"
                    ? "Ongoing Events"
                    : selected === "past"
                    ? "Past Events"
                    : "Events with Food 🍕"}
                </h2>
                <select
                  className="w-full p-2 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  <option value="upcoming">Upcoming Events</option>
                  <option value="ongoing">Ongoing Events</option>
                  <option value="food">Events with Food</option>
                  <option value="past">Past Events</option>
                </select>
              </div>

               <div className="mt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Filter by Club</label>
                  <select
                    className="w-full p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    value={club}
                    onChange={(e) => setClub(e.target.value)}
                  >
                    {CLUBS.map((club) => (
                      <option key={club} value={club}>
                        {club}
                      </option>
                    ))}
                  </select>
                </div>

              <div className="flex-1 overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">
                    No {selected} events yet.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {
                    events.map((event) => {
                      const formatDateTime = (value) => {
                        if (!value) return "";
                        const d =
                          typeof value.toDate === "function"
                            ? value.toDate()
                            : value instanceof Date
                            ? value
                            : null;
                        if (!d) return "";
                        return d.toLocaleString([], {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        });
                      };

                      return (
                        <li
                          key={event.id}
                          className="p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-base text-slate-900">
                                {event.title}
                              </h3>
                              <p className="text-xs text-slate-600 mt-1">
                                {event.category} @{" "}
                                {event.locationId.replace(/_/g, " ")}
                              </p>
                              {event.club && (
                                <p className="text-xs text-amber-700 font-medium mt-0.5">
                                  🏛️ {event.club}
                                </p>
                              )}
                              <p className="text-slate-700 mt-1 text-sm">
                                {event.description}
                              </p>
                              {(event.start_time || event.end_time) && (
                                <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                                  {event.start_time && (
                                    <p>
                                      Starts: {formatDateTime(event.start_time)}
                                    </p>
                                  )}
                                  {event.end_time && (
                                    <p>
                                      Ends: {formatDateTime(event.end_time)}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                            {event.hasFood && (
                              <span className="ml-2 px-2 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full whitespace-nowrap">
                                🍕
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventList;
