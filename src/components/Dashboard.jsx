import { useEffect,useState } from "react";
import { X, Calendar, MapPin, Users, Utensils, Trash2, Edit } from "lucide-react"
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
export default function Dashboard({
  user,
  upcomingEvents,
  ongoingEvents,
  pastEvents,
  setDashboard=()=>{},
  onEdit=true,
  onDelete=true,
}) {
  const [activeFilter, setActiveFilter] = useState("upcoming"); 

  const filterMap = {
    upcoming: upcomingEvents,
    ongoing: ongoingEvents,
    past: pastEvents,
  }
   const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const displayedEvents = filterMap[activeFilter]
  const allEvents = [...upcomingEvents, ...ongoingEvents, ...pastEvents]
  async function handleDelete(){
    const id=deleteConfirmId;
    setDeleteConfirmId(null);
    try{
      await deleteDoc(doc(db,"events",id));
    }catch(err){
      throw new Error("Error in deleting" ,err);
    }
  }
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
  const EventCard = ({ event }) => (
    <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-lg p-4 hover:shadow-lg transition-all hover:border-blue-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 text-base">
            {event.title}
          </h3>
          {event.category && (
            <span className="inline-block mt-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
              {event.category}
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
        {event.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-slate-700">
          <Calendar size={16} className="text-blue-600 flex-shrink-0" />
          <span className="text-sm">
            {formatDateTime(event.start_time)} •{" "}
            {formatDateTime(event.start_time)}
            {event.end_time && ` - ${formatDateTime(event.end_time)}`}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          <MapPin size={16} className="text-blue-600 flex-shrink-0" />
          <span className="text-sm">
            {event.locationName || event.locationId || "Location TBA"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          <Users size={16} className="text-blue-600 flex-shrink-0" />
          <span className="text-sm font-medium">{event.club}</span>
        </div>

        {event.hasFood && (
          <div className="flex items-center gap-2 text-slate-700">
            <Utensils size={16} className="text-green-600 flex-shrink-0" />
            <span className="text-sm font-medium text-green-700">
              Food provided
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-3 border-t border-slate-200">
        {onEdit && activeFilter === "upcoming" && (
          <button
            onClick={() => onEdit(event.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded font-medium text-sm transition-colors"
          >
            <Edit size={16} />
            Edit
          </button>
        )}
        {onDelete && activeFilter === "upcoming" && (
          <button
            onClick={() => setDeleteConfirmId(event.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded font-medium text-sm transition-colors"
          >
            <Trash2 size={16} />
            Delete
          </button>
        )}
      </div>
    </div>
  );

  const hasEvents = allEvents.length > 0
  const hasDisplayedEvents = displayedEvents.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col p-6 sm:p-8">
        <button
          onClick={() => setDashboard(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Hello {user?.displayName || "User"}
          </h1>
          <p className="text-slate-600 mt-2">
            {hasEvents
              ? `You've created ${allEvents.length} event${
                  allEvents.length !== 1 ? "s" : ""
                }`
              : "You haven't created any events yet"}
          </p>
        </div>

        {hasEvents && (
          <div className="flex gap-2 mb-6 border-b border-slate-200">
            {["upcoming", "ongoing", "past"].map((filter) => {
              const counts = {
                upcoming: upcomingEvents.length,
                ongoing: ongoingEvents.length,
                past: pastEvents.length,
              };
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-3 font-medium text-sm transition-all border-b-2 ${
                    activeFilter === filter
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  <span className="ml-2 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs">
                    {counts[filter]}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="overflow-y-auto flex-1 pr-2">
          {hasEvents ? (
            hasDisplayedEvents ? (
              <div className="space-y-3">
                {displayedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-slate-400 mb-3">
                  <Calendar size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  No {activeFilter} events
                </h3>
                <p className="text-slate-600">
                  Create your first event to get started!
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-3">
                <Calendar size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                No events yet
              </h3>
              <p className="text-slate-600">
                Create your first event to get started!
              </p>
            </div>
          )}
        </div>
      </div>
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[51] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-[90%]">
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Delete Event?
            </h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded font-medium text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}