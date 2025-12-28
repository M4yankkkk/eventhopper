import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.svg';
import Background from '../assets/Background.png';
import StayUpdated from '../assets/Stay Updated.png';
import DiscoverEvents from '../assets/Discover Events.png';
import ConnectJoin from '../assets/Connect & Join.png';
import BrokenComm from '../assets/Broken Communication.png';
import DisconnectFomo from '../assets/Disconnect and FOMO.png';
import LowEngagement from '../assets/Low Engagement.png';
import DashedLine1 from '../assets/Dahsed Line1.png';
import DashedLine2 from '../assets/Dashed Line2.png';
import MobilePreview from '../assets/MobilePreview.png';
import Overview from '../assets/Overview.png';

export default function Landing() {
  return (
    <main className="min-h-screen w-full bg-white text-slate-900 overflow-x-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200/50">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <img src={Logo} alt="EventX" className="h-6 sm:h-7 font-bold" />
          <Link to="/app" className="rounded-lg bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">Sign in</Link>
        </div>
      </header>

      {/* Hero with Background */}
      <section className="relative w-full bg-cover bg-center min-h-screen overflow-hidden" style={{ backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center min-h-screen">
          <img src={Logo} alt="EventX" className="h-12 sm:h-14 mb-6" />
          <p className="text-4xl sm:text-6xl font-bold text-black leading-tight">
            Your Campus, <span className="text-indigo-600">Connected!</span>
          </p>

          <Link
            to="/app"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 sm:px-8 py-3 text-base sm:text-lg font-bold text-white shadow-lg transition hover:bg-indigo-500"
          >
            Discover
          </Link>

          {/* Mobile: stacked images */}
          <div className="mt-12 flex sm:hidden flex-col items-center gap-6">
            <img src={StayUpdated} alt="Stay Updated" className="h-auto w-auto" style={{ maxWidth: '200px' }} />
            <img src={DiscoverEvents} alt="Discover Events" className="h-auto w-auto" style={{ maxWidth: '260px' }} />
            <img src={ConnectJoin} alt="Connect & Join" className="h-auto w-auto" style={{ maxWidth: '200px' }} />
          </div>

          {/* Desktop: downward arrow pattern */}
          <div className="hidden sm:block mt-16 relative w-full max-w-5xl h-80">
            {/* Left image - top left */}
            <div className="absolute left-0 top-0 -translate-x-9 translate-y-1/8">
              <img src={StayUpdated} alt="Stay Updated" className="h-auto w-auto" style={{ maxWidth: '200px' }} />
            </div>
            {/* Center image - center bottom */}
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-10">
              <img src={DiscoverEvents} alt="Discover Events" className="h-auto w-auto max-w-xs"  style={{ maxWidth: '380px' }}/>
            </div>
            {/* Right image - top right */}
            <div className="absolute right-0 top-0 translate-x-1/4 translate-y-1">
              <img src={ConnectJoin} alt="Connect & Join" className="h-auto w-auto max-w-xs" style={{ maxWidth: '270px' }} />
            </div>
          </div>
        </div>
      </section>

      {/* What We Solve */}
      <section className="bg-white px-6 py-16">
        <h2 className="text-center text-3xl sm:text-6xl font-bold tracking-tight mb-8 sm:mb-16" style={{transform: 'translateY(20px) sm:translateY(60px)'}}>What We Solve.</h2>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-20" style={{transform: 'translateY(-45px) sm:translateY(-90px)'}}>
            {/* Broken Communication */}
            <div className="flex flex-col items-center">
              <img src={BrokenComm} alt="Broken Communication" className="h-auto w-auto mb-4 sm:mb-6 max-w-[300px] sm:max-w-[500px]" style={{ transform: 'translateX(40px) translateY(40px)' }} />
              <h3 className="font-bold text-xl sm:text-3xl text-black mb-2 text-center">Broken Communication</h3>
              <p className="text-sm sm:text-lg text-slate-700 leading-relaxed text-center">Centralizes all campus event information, eliminating missed opportunities from scattered posts and emails.</p>
            </div>

            {/* Disconnect & FOMO */}
            <div className="flex flex-col items-center">
              <img src={DisconnectFomo} alt="Disconnect & FOMO" className="h-auto w-auto mb-4 sm:mb-6 max-w-[300px] sm:max-w-[500px]" style={{ transform: 'translateX(40px) translateY(40px)' }} />
              <h3 className="font-bold text-xl sm:text-3xl text-black mb-2 text-center">Disconnect & FOMO</h3>
              <p className="text-sm sm:text-lg text-slate-700 leading-relaxed text-center">Connects students directly to campus life, ensuring they never miss out on events, workshops, or socials.</p>
            </div>

            {/* Low Engagement */}
            <div className="flex flex-col items-center">
              <img src={LowEngagement} alt="Low Engagement" className="h-auto w-auto mb-4 sm:mb-6 max-w-[300px] sm:max-w-[500px]" style={{ transform: 'translateX(40px) translateY(40px)' }} />
              <h3 className="font-bold text-xl sm:text-3xl text-black mb-2 text-center">Low Engagement</h3>
              <p className="text-sm sm:text-lg text-slate-700 leading-relaxed text-center">Boosts attendance by making it easy for students to discover, track, and join events they care about.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white px-4 sm:px-6 py-16 sm:py-20">
        <h2 className="text-center text-4xl sm:text-6xl font-bold tracking-tight mb-10 sm:mb-12">The Overview.</h2>
        <div className="max-w-5xl mx-auto flex justify-center" style={{transform: 'translateY:'}}>
          <img src={MobilePreview} alt="EventHopper Overview Mobile" className="h-auto w-full sm:hidden" />
          <img src={Overview} alt="EventHopper Overview" className="hidden sm:block h-auto" style={{ width: '110%', maxWidth: '1400px', transform: 'translateY(-60px)' }} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white px-4 sm:px-6 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <img src={Logo} alt="EventX" className="h-8 mb-4" style={{ filter: 'invert(1) brightness(1.8)' }} />
              <p className="text-sm sm:text-base text-slate-300">Your Campus, Connected!</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3 text-base sm:text-lg">Quick Links</h4>
              <ul className="space-y-2 text-sm sm:text-base text-slate-300">
                <li><Link to="/app" className="hover:text-white transition">Discover Events</Link></li>
                <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3 text-base sm:text-lg">Contact</h4>
              <p className="text-sm sm:text-base text-slate-300">NITK Surathkal Campus</p>
              <p className="text-sm sm:text-base text-slate-300">Mangalore, India</p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-6">
            <p className="text-center text-xs sm:text-sm text-slate-400">&copy; 2025 EventX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
