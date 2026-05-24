import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Bell, Shield, PaintBucket,
  Save, LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || ''
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateUser({ name: profileData.name });
      setIsSaving(false);
      addNotification({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your profile settings have been successfully updated.'
      });
      onClose();
    }, 800);
  };

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <PaintBucket className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-obsidian-900/80 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] max-h-[90vh]"
          >
            {/* Sidebar Tabs */}
            <div className="w-full md:w-72 bg-black/20 border-r border-white/[0.05] p-6 flex flex-col">
              <div className="flex items-center justify-between mb-10 px-2 mt-2">
                <h2 className="text-3xl font-black tracking-tighter text-white">Settings</h2>
                <button 
                  onClick={onClose}
                  className="md:hidden text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-xs font-black tracking-widest uppercase transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-biolum-teal/10 text-biolum-teal border border-biolum-teal/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                        : 'text-gray-500 hover:bg-black/20 hover:text-gray-300 border border-transparent'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-white/[0.05]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-4 px-5 py-4 text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-2xl text-xs font-black tracking-widest uppercase transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col h-full bg-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-biolum-teal/5 rounded-full blur-[120px] pointer-events-none" />
              <button 
                onClick={onClose}
                className="hidden md:flex absolute top-6 right-6 p-2 text-gray-500 hover:text-white hover:bg-black/40 rounded-full transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 overflow-y-auto p-6 md:p-12 relative z-10 scrollbar-hide">
                {activeTab === 'profile' && (
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-3xl font-black tracking-tighter text-white mb-2">Profile Details</h3>
                      <p className="text-xs font-bold tracking-widest uppercase text-gray-500">Update your personal information.</p>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-biolum-teal to-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                        {profileData.name.charAt(0) || 'U'}
                      </div>
                      <button className="px-6 py-3 bg-black/20 hover:bg-black/40 border border-white/[0.1] rounded-2xl text-xs text-white font-black tracking-widest uppercase transition-colors">
                        Change Avatar
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black tracking-widest uppercase text-gray-500 mb-2">Full Name</label>
                        <input 
                          type="text" 
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full bg-black/20 border border-white/[0.1] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-biolum-teal/50 focus:bg-black/40 transition-all font-bold tracking-wide"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black tracking-widest uppercase text-gray-500 mb-2">Email Address</label>
                        <input 
                          type="email" 
                          value={user?.email || ''}
                          disabled
                          className="w-full bg-white/[0.01] border border-white/[0.05] rounded-2xl px-6 py-4 text-gray-500 font-bold tracking-wide cursor-not-allowed"
                        />
                        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-600 mt-2">Email address cannot be changed.</p>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black tracking-widest uppercase text-gray-500 mb-2">Role</label>
                        <input 
                          type="text" 
                          value={user?.role?.replace('_', ' ') || ''}
                          disabled
                          className="w-full bg-white/[0.01] border border-white/[0.05] rounded-2xl px-6 py-4 text-biolum-teal font-black tracking-widest uppercase text-xs cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-3xl font-black tracking-tighter text-white mb-2">App Preferences</h3>
                      <p className="text-xs font-bold tracking-widest uppercase text-gray-500">Customize your workspace experience.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-6 bg-black/20 border border-white/[0.05] rounded-3xl">
                        <div>
                          <div className="text-white font-bold tracking-wide">Dark Mode</div>
                          <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mt-1">Toggle between light and dark themes</div>
                        </div>
                        <div 
                          onClick={toggleTheme}
                          className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${isDark ? 'bg-biolum-teal shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-gray-400'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${isDark ? 'bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)] right-1' : 'bg-white left-1'}`}></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-black/20 border border-white/[0.05] rounded-3xl">
                        <div>
                          <div className="text-white font-bold tracking-wide">Compact View</div>
                          <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mt-1">Reduce spacing in tables and lists</div>
                        </div>
                        <div className="w-12 h-6 bg-white/[0.1] rounded-full relative cursor-pointer">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-3xl font-black tracking-tighter text-white mb-2">Notification Settings</h3>
                      <p className="text-xs font-bold tracking-widest uppercase text-gray-500">Manage what alerts you receive.</p>
                    </div>
                    
                    <div className="space-y-4">
                      {['Data Processing Alerts', 'System Updates', 'Model Training Completion', 'New Research Published'].map((item, i) => (
                        <label key={i} className="flex items-center space-x-4 cursor-pointer group p-4 bg-white/[0.01] hover:bg-black/20 border border-white/[0.05] rounded-2xl transition-colors">
                          <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${i !== 3 ? 'bg-biolum-teal/20 border-biolum-teal text-biolum-teal shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'bg-transparent border-white/[0.2] group-hover:border-white/[0.4]'}`}>
                            {i !== 3 && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <span className="text-gray-400 group-hover:text-white font-bold tracking-wide transition-colors">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-3xl font-black tracking-tighter text-white mb-2">Security Settings</h3>
                      <p className="text-xs font-bold tracking-widest uppercase text-gray-500">Manage your account security.</p>
                    </div>

                    <div className="space-y-4">
                      <button className="px-6 py-4 bg-black/20 hover:bg-black/40 border border-white/[0.05] rounded-2xl text-white font-black tracking-widest uppercase text-[10px] transition-colors w-full text-left">
                        Change Password
                      </button>
                      <button className="px-6 py-4 bg-black/20 hover:bg-black/40 border border-white/[0.05] rounded-2xl text-white font-black tracking-widest uppercase text-[10px] transition-colors w-full text-left">
                        Two-Factor Authentication (2FA)
                      </button>
                    </div>
                    
                    <div className="pt-8 border-t border-white/[0.05]">
                      <button className="px-6 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl text-red-400 font-black tracking-widest uppercase text-[10px] transition-colors w-full text-left">
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 md:p-8 border-t border-white/[0.05] bg-transparent flex justify-end relative z-10">
                <div className="flex space-x-4">
                  <button 
                    onClick={onClose}
                    className="px-8 py-3.5 rounded-2xl text-gray-400 hover:text-white hover:bg-black/40 font-black tracking-widest uppercase text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-8 py-3.5 bg-biolum-teal hover:bg-cyan-400 text-obsidian-900 rounded-2xl font-black tracking-widest uppercase text-xs transition-colors disabled:opacity-50 w-32 justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default SettingsModal;
