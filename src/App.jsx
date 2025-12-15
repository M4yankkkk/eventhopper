import { useState, useEffect } from 'react';
import { auth, firebase } from './firebase';
import MapComponent from './components/MapComponent';
import EventInput from './components/EventInput';
import EventList from './components/EventList';

const Login = ({ signIn }) => <button onClick={signIn} className="absolute top-4 right-4 p-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg">Sign in with Google</button>;
const Logout = ({ user, logOut }) => (
  <div className="absolute top-4 right-4 flex items-center gap-3 bg-slate-800/60 p-2 rounded-lg shadow-lg">
    <img src={user.photoURL} alt={user.displayName} className="h-8 w-8 rounded-full" />
    <button onClick={logOut} className="p-2 bg-red-600 text-white font-bold rounded-lg">Logout</button>
  </div>
);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Check if email domain is @nitk.edu.in
        if (!user.email?.endsWith('@nitk.edu.in')) {
          alert('Access restricted to NITK email addresses only (@nitk.edu.in)');
          await auth.signOut();
          setUser(null);
          return;
        }
      }
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      hd: 'nitk.edu.in' // Hint to Google to show only NITK accounts
    });
    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      
      // Verify email domain
      if (!user.email?.endsWith('@nitk.edu.in')) {
        alert('Only NITK email addresses (@nitk.edu.in) are allowed to sign in.');
        await auth.signOut();
        return;
      }
    } catch (error) {
      console.error("Error signing in: ", error);
      if (error.code !== 'auth/popup-closed-by-user') {
        alert('Sign in failed. Please try again.');
      }
    }
  };

  const logOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <main className="h-screen w-screen bg-slate-900 text-white relative overflow-hidden">
      <MapComponent />
      <EventInput />
      <EventList />
      {user ? <Logout user={user} logOut={logOut} /> : <Login signIn={signIn} />}
    </main>
  );
}

export default App;

