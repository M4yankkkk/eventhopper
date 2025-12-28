import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import Logo from './assets/Logo.svg';
import MapComponent from './components/MapComponent';
import EventInput from './components/EventInput';
import EventList from './components/EventList';
import { getMessaging, getToken,onMessage } from "firebase/messaging";
import { ensureUserDoc } from './firebase';
import {doc,setDoc} from 'firebase/firestore'
const messaging = getMessaging();

async function initNotifications(user) {
   if (!user || !user.uid) {
    console.log(user);
    console.warn("User not ready, skipping notifications");
    return;
  }

  console.log("Notification permission:", Notification.permission);
  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await generateAndStoreToken(user.uid);
    }
  } 
  else if (Notification.permission === "granted") {
    await generateAndStoreToken(user.uid);
  }
  // denied → do nothing
}
async function generateAndStoreToken(uid) {
  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  });

  if (token) {
    console.log("FCM Token:", token);
    console.log(uid);
  


    try{
      console.log("Is window available?", window === undefined);
console.log("Is document available?", document===undefined);

      console.log("➡️ before setDoc");
     await setDoc(
    doc(db, "users", uid),
    {
      fcmTokens: {
        [token]: true, // ✅ map → no duplicates
      },
    },
    { merge: true } // ✅ don't overwrite existing tokens
  );
  console.log("success");
}
catch (e) {
    console.error("❌ Firestore write failed", e);
  }
};
  

  
  };
    




function App() {
  const [User, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('upcoming');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  useEffect(() => {
  onMessage(messaging, (payload) => {
    console.log("Foreground FCM:", payload);

    new Notification(payload.notification.title, {
      body: payload.notification.body,
    });
  });
}, []);
  useEffect(()=>{
   if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then(() => console.log("✅ Service Worker registered"))
    .catch(console.error);
}

  },[])
  useEffect(() => {
  console.log("1: useEffect ran");

  const testFirestore = async () => {
    console.log("2: function entered");

    try {
      console.log("3: before setDoc");

      await setDoc(doc(db, "debug", "check"), {
        ok: true,
        time: Date.now(),
      });

      console.log("4: WRITE SUCCESS");
    } catch (e) {
      console.error("5: WRITE FAILED:", e);
    }
  };

  testFirestore();
}, []);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        //Check if email domain is @nitk.edu.in
        if (!user.email?.endsWith('@nitk.edu.in')) {
          alert('Access restricted to NITK email addresses only (@nitk.edu.in)');
          await signOut(auth);
          setUser(null);
          return;
        }
      }
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Handle redirect result after OAuth redirect
  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        const user = result.user;
        if (!user.email?.endsWith('@nitk.edu.in')) {
          alert('Only NITK email addresses (@nitk.edu.in) are allowed to sign in.');
          signOut(auth);
        }
      }
    }).catch((error) => {
      console.error("Redirect result error:", error);
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        console.error("Auth error:", error.message);
      }
    });
  }, []);

  // Fetch events from Firestore
  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  // Normalize Firestore timestamps and build filtered buckets
  const now = new Date();
  const normalizedEvents = events.map((event) => {
    const normalize = (ts) => {
      if (!ts) return null;
      if (typeof ts.toDate === 'function') return ts.toDate();
      if (ts instanceof Date) return ts;
      return null;
    };
    return {
      ...event,
      start_time: normalize(event.start_time),
      end_time: normalize(event.end_time),
    };
  });

  const upcomingEvents = normalizedEvents.filter((e) => e.start_time && e.start_time >= now);
  const ongoingEvents = normalizedEvents.filter(
    (e) => e.start_time && e.end_time && e.start_time < now && e.end_time >= now
  );
  const pastEvents = normalizedEvents.filter((e) => e.end_time && e.end_time < now);
  const foodEvents = normalizedEvents.filter((e) => e.hasFood);

  const mapping = {
    upcoming: upcomingEvents,
    ongoing: ongoingEvents,
    past: pastEvents,
    food: foodEvents,
  };

  const selectedEvents = mapping[selectedFilter] || normalizedEvents;

  const signIn = async () => {
    if (isSigningIn) {
      console.log('Sign in already in progress, ignoring...');
      return;
    }
    
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      hd: 'nitk.edu.in' // Hint to Google to show only NITK accounts
    });
    try {
      console.log('Starting sign in...');
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Use redirect on mobile
        console.log('Using redirect auth for mobile');
        await signInWithRedirect(auth, provider);
      } else {
        // Use popup on desktop
        console.log('Using popup auth for desktop');
        const result = await signInWithPopup(auth, provider);
        console.log('Sign in successful:', result.user);
        const user = result.user;
        
        //Verify email domain
        if (!user.email?.endsWith('@nitk.edu.in')) {
          alert('Only NITK email addresses (@nitk.edu.in) are allowed to sign in.');
          await signOut(auth);
          return;
        }
        setUser(user);
        await ensureUserDoc(result.user);
        console.log(result.user);
        initNotifications(result.user);


      }
    } catch (error) {
      console.error("Error signing in: ", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      if (error.code === 'auth/popup-blocked') {
        alert('Popup was blocked. Please allow popups for this site and try again.');
      } else if (error.code === 'auth/unauthorized-domain') {
        alert('This domain is not authorized. Please add it to Firebase authorized domains.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Silently ignore cancelled popup - user likely clicked multiple times
        console.log('Popup cancelled - ignoring');
      } else if (error.code !== 'auth/popup-closed-by-user') {
        console.error(`Sign in error: ${error.message}`);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <main className="h-screen w-screen bg-white text-slate-900 relative overflow-hidden">
      {/* Navbar */}
      <header className="absolute top-0 left-0 right-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200/50">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="EventHopper" className="h-6 sm:h-7" />
          </Link>
          <div className="flex items-center gap-3">
            {User ? (
              <>
                <button onClick={()=>{initNotifications(User)}}>enable</button>
                <img src={User.photoURL} alt={User.displayName} className="h-8 w-8 rounded-full border-2 border-indigo-500" />
                <button onClick={logOut} className="rounded-lg bg-red-600 px-3 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-red-500">Logout</button>
              </>
            ) : (
              <button onClick={signIn} className="rounded-lg bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed" disabled={isSigningIn}>
                {isSigningIn ? 'Signing in...' : 'Sign in'}
              </button>
            )}
          </div>
        </div>
      </header>

      <MapComponent events={selectedEvents} />
      <EventList
        events={selectedEvents}
        selected={selectedFilter}
        setSelected={setSelectedFilter}
        mapping={mapping}
      />

      {/* Floating Add Button */}
      {User && (
        <button
          onClick={() => setShowAddEvent(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 sm:w-16 sm:h-16 rounded-full backdrop-blur supports-[backdrop-filter]:bg-indigo-600/90 bg-indigo-600 text-white shadow-2xl hover:bg-indigo-500 transition-all hover:scale-110 flex items-center justify-center border border-indigo-400/20"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-[90%] max-w-xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setShowAddEvent(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Add New Event</h2>
            <EventInput onClose={() => setShowAddEvent(false)} />
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
