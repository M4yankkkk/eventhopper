import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Laptop, Music, Dribbble, Lightbulb, UtensilsCrossed } from 'lucide-react';

const categoryConfig = {
  TECH: {
    icon: <Laptop size={18} />,
    color: 'bg-tech',
    shadow: 'shadow-[0_0_15px_5px_rgba(6,182,212,0.7)]',
  },
  CULTURAL: {
    icon: <Music size={18} />,
    color: 'bg-cultural',
    shadow: 'shadow-[0_0_15px_5px_rgba(236,72,153,0.7)]',
  },
  SPORTS: {
    icon: <Dribbble size={18} />,
    color: 'bg-sports',
    shadow: 'shadow-[0_0_15px_5px_rgba(16,185,129,0.7)]',
  },
  WORKSHOP: {
    icon: <Lightbulb size={18} />,
    color: 'bg-workshop',
    shadow: 'shadow-[0_0_15px_5px_rgba(249,115,22,0.7)]',
  },
  OTHER: {
    icon: <Lightbulb size={18} />,
    color: 'bg-gray-500',
    shadow: 'shadow-[0_0_15px_5px_rgba(107,114,128,0.7)]',
  },
  DEFAULT: {
    icon: null,
    color: 'bg-gray-500',
    shadow: 'shadow-[0_0_15px_5px_rgba(107,114,128,0.7)]',
  }
};

const BeaconMarker = ({ event, isSelected, onSelect }) => {
  const { category, coords, title, hasFood } = event;
  const config = hasFood ? {
    icon: <UtensilsCrossed size={18} />,
    color: 'bg-yellow-400',
    shadow: 'shadow-[0_0_15px_5px_rgba(234,179,8,0.7)]',
  } : (categoryConfig[category] || categoryConfig.DEFAULT);
  const isPulsing = hasFood;
  
  return (
    <AdvancedMarker position={coords}>
      <div 
        className="flex flex-col items-center beacon-float cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {/* The icon */}
        <div className={`
          w-8 h-8 rounded-full 
          flex items-center justify-center 
          ${hasFood ? 'text-black' : 'text-white'}
          ${config.color} 
          ${config.shadow}
          ${isPulsing ? 'animate-pulse' : ''}
          ${isSelected ? 'scale-125 ring-4 ring-white' : 'hover:scale-110'}
          transition-all duration-200
          z-10
        `}>
          {config.icon}
        </div>
        
        {/* The beam */}
        <div className={`
          w-1.5 h-16 
          ${config.color}
          opacity-75
        `} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
        </div>
        
        {/* Ground glow */}
        <div className={`
          w-8 h-8 rounded-full 
          ${config.color}
          blur-lg
          opacity-50
          absolute
          bottom-[-1rem]
        `}>
        </div>

        {/* Pulsing ripple */}
        {isPulsing && <div className="beacon-pulse"></div>}

      </div>
    </AdvancedMarker>
  );
};

export default BeaconMarker;
