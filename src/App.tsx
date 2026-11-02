/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  LayoutGrid,
  Wand2,
  Image as ImageIcon,
  Scissors,
  Film,
  Settings,
} from 'lucide-react';
import { AppView, UserProfile, VideoCreation, VideoStyleId } from './types';
import { AvinashLogo } from './components/AvinashLogo';
import { SplashScreen } from './components/SplashScreen';
import { Dashboard } from './components/Dashboard';
import { VideoGeneratorStudio } from './components/VideoGeneratorStudio';
import { AIVideoEditingSuite } from './components/AIVideoEditingSuite';
import { MyCreations } from './components/MyCreations';
import { AccountSettings } from './components/AccountSettings';
import {
  clearAllVideoCreations,
  deleteVideoCreation,
  getAllVideoCreations,
  loadUserProfile,
  saveUserProfile,
  saveVideoCreation,
} from './utils/storage';

import creatorAvatar from './assets/images/avinash_creator_avatar_1793615143294.jpg';

const NAV_ITEMS: {
  id: AppView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'text-to-video', label: 'Text to Video', icon: Wand2 },
  { id: 'image-to-video', label: 'Image to Video', icon: ImageIcon },
  { id: 'editing-tools', label: 'AI Editing', icon: Scissors },
  { id: 'creations', label: 'My Creations', icon: Film },
];

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [presetStyle, setPresetStyle] = useState<VideoStyleId>('Cinematic');
  const [presetPrompt, setPresetPrompt] = useState<string>('');
  const [creations, setCreations] = useState<VideoCreation[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    loadUserProfile(creatorAvatar)
  );

  useEffect(() => {
    getAllVideoCreations().then((saved) => {
      setCreations(saved);
    });
  }, []);

  const handleSaveCreation = async (creation: VideoCreation) => {
    setCreations((prev) => [creation, ...prev]);
    try {
      await saveVideoCreation(creation);
    } catch {
      // ignore storage quota errors on ultra-large blobs
    }
  };

  const handleDeleteCreation = async (id: string) => {
    setCreations((prev) => prev.filter((c) => c.id !== id));
    await deleteVideoCreation(id);
  };

  const handleClearAllCreations = async () => {
    setCreations([]);
    await clearAllVideoCreations();
  };

  const handleUpdateProfile = (next: UserProfile) => {
    setUserProfile(next);
    saveUserProfile(next);
  };

  const handleNavigateGenerator = (
    targetView: AppView,
    style?: VideoStyleId,
    promptText?: string
  ) => {
    if (style) setPresetStyle(style);
    if (promptText !== undefined) setPresetPrompt(promptText);
    setActiveView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showSplash) {
    return <SplashScreen onEnterStudio={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#050509] text-slate-100 flex flex-col relative selection:bg-cyan-500/30">
      {/* Subtle Ambient Studio Backdrops */}
      <div className="fixed -top-48 left-1/4 w-[38rem] h-[38rem] rounded-full bg-cyan-500/8 blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/5 w-[36rem] h-[36rem] rounded-full bg-purple-600/8 blur-[150px] pointer-events-none z-0" />

      {/* Top Navigation Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-40 h-16 glass-panel border-b border-white/10 px-4 sm:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => setActiveView('dashboard')}
          className="cursor-pointer shrink-0 whitespace-nowrap focus:outline-none"
        >
          <AvinashLogo size="sm" showWordmark={true} />
        </button>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive ? 'text-cyan-300 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="topNavUnderline"
                    className="absolute left-0 right-0 -bottom-[19px] h-[2px] bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action / Account Studio Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setActiveView('settings')}
            className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
              activeView === 'settings'
                ? 'bg-cyan-500/20 border-cyan-400 text-white'
                : 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4 text-cyan-400" />
            <span>{userProfile.authMethod === 'guest' ? 'Account & Settings' : userProfile.name}</span>
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 pt-8 pb-24 md:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {activeView === 'dashboard' && (
              <Dashboard
                onNavigateGenerator={handleNavigateGenerator}
                totalCreations={creations.length}
              />
            )}

            {activeView === 'text-to-video' && (
              <VideoGeneratorStudio
                mode="text-to-video"
                initialStyle={presetStyle}
                initialPrompt={presetPrompt}
                defaultQuality={userProfile.defaultQuality}
                defaultAspectRatio={userProfile.defaultAspectRatio}
                onSaveCreation={handleSaveCreation}
              />
            )}

            {activeView === 'image-to-video' && (
              <VideoGeneratorStudio
                mode="image-to-video"
                initialStyle={presetStyle}
                initialPrompt={presetPrompt}
                defaultQuality={userProfile.defaultQuality}
                defaultAspectRatio={userProfile.defaultAspectRatio}
                onSaveCreation={handleSaveCreation}
              />
            )}

            {activeView === 'editing-tools' && (
              <AIVideoEditingSuite
                creations={creations}
                onSaveCreation={handleSaveCreation}
              />
            )}

            {activeView === 'creations' && (
              <MyCreations
                creations={creations}
                onDeleteCreation={handleDeleteCreation}
                onClearAll={handleClearAllCreations}
                onNavigate={setActiveView}
              />
            )}

            {activeView === 'settings' && (
              <AccountSettings
                profile={userProfile}
                creations={creations}
                onUpdateProfile={handleUpdateProfile}
                onClearHistory={handleClearAllCreations}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation Bar (Compact <= 10% Viewport Height) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 glass-panel border-t border-white/10 px-2 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium cursor-pointer ${
                active ? 'text-cyan-300' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="whitespace-nowrap">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
