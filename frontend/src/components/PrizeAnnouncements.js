import React, { useState } from 'react';
import { Trophy, Camera, X, Info, Instagram } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const PrizeAnnouncement = () => {
  // Return null to temporarily disable the prize announcement
  // Uncomment the code below when you want to show the prize announcement again
  return null;

  /*
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  
  // Close the announcement
  const handleClose = () => {
    setIsOpen(false);
    // Save preference to avoid showing again in this session
    sessionStorage.setItem('prizeAnnouncementClosed', 'true');
  };
  
  // Check if announcement was closed already
  if (sessionStorage.getItem('prizeAnnouncementClosed') === 'true' || !isOpen) {
    return null;
  }
  
  return (
    <div className={`fixed bottom-20 left-0 right-0 mx-auto z-50 max-w-2xl px-4`}>
      <div className={`bg-gradient-to-r from-yellow-800 to-amber-700 rounded-xl p-4 shadow-2xl relative overflow-hidden border-2 border-yellow-500/50`}>
        {/* Background effects *//*}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full -mr-8 -mt-8 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-400/20 rounded-full -ml-5 -mb-5 blur-2xl"></div>
        
        {/* Close button *//*}
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 text-white/70 hover:text-white bg-black/10 hover:bg-black/30 rounded-full transition-colors"
          aria-label="Close announcement"
        >
          <X className="w-4 h-4" />
        </button>
        
        {/* Content *//*}
        <div className="flex items-center gap-4">
          <div className="bg-yellow-500/30 p-3 rounded-lg">
            <Trophy className="w-10 h-10 text-yellow-300" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">$100 PRIZE ANNOUNCEMENT!</h3>
            <p className="text-yellow-100 text-sm mt-1">
              The first player to win on Ninja mode wins $100! Take a screenshot and DM @ace.sq on Instagram to claim.
            </p>
            
            <div className="flex items-center gap-2 mt-3">
              <a 
                href="https://instagram.com/ace.sq" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-black/30 hover:bg-black/40 text-white text-xs font-medium py-1 px-3 rounded-full transition-colors"
              >
                <Instagram className="w-3 h-3" />
                <span>@ace.sq</span>
              </a>
              
              <div className="flex items-center text-xs text-white/80">
                <Camera className="w-3 h-3 mr-1" />
                <span>Screenshot your win!</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-yellow-600/50 text-xs text-white/70 flex items-start">
          <Info className="w-3 h-3 mr-1 flex-shrink-0 mt-0.5" />
          <p>Prize valid until claimed. One winner only. Contest open to all players.</p>
        </div>
      </div>
    </div>
  );
  */
};

export default PrizeAnnouncement;