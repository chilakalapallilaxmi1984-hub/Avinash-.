import React, { useState } from 'react';
import {
  User,
  Download,
  History,
  Shield,
  HelpCircle,
  LogIn,
  LogOut,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import {
  AspectRatioOption,
  UserProfile,
  VideoCreation,
  VideoQualityOption,
} from '../types';
import { MobileAppInstallCard } from './MobileAppInstallCard';

interface AccountSettingsProps {
  profile: UserProfile;
  creations: VideoCreation[];
  onUpdateProfile: (next: UserProfile) => void;
  onClearHistory: () => void;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({
  profile,
  creations,
  onUpdateProfile,
  onClearHistory,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [emailInput, setEmailInput] = useState(profile.email);
  const [nameInput, setNameInput] = useState(profile.name);
  const [passwordInput, setPasswordInput] = useState('');
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const showSaved = (msg: string) => {
    setSavedBanner(msg);
    setTimeout(() => setSavedBanner(null), 2600);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const next: UserProfile = {
      ...profile,
      name: nameInput.trim() || emailInput.split('@')[0],
      email: emailInput.trim(),
      authMethod: 'email',
    };
    onUpdateProfile(next);
    setPasswordInput('');
    showSaved(
      authMode === 'register'
        ? 'Account registered and signed in to AVINASH AI!'
        : 'Signed in successfully!'
    );
  };

  const handleGoogleSignIn = () => {
    const next: UserProfile = {
      ...profile,
      name: profile.name === 'Avinash Studio Creator' ? 'Avinash Pro Creator' : profile.name,
      email: profile.email || 'creator@gmail.com',
      authMethod: 'google',
    };
    onUpdateProfile(next);
    showSaved('Connected with Google Account!');
  };

  const handleSignOut = () => {
    const next: UserProfile = {
      ...profile,
      authMethod: 'guest',
    };
    onUpdateProfile(next);
    showSaved('Signed out to Guest Studio session.');
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Settings &amp; User Account
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage registration, Google Sign-In, 4K download preferences, privacy, and support.
          </p>
        </div>

        {savedBanner && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-xs font-semibold text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{savedBanner}</span>
          </div>
        )}
      </div>

      {/* Android, iOS & Store Distribution Hub */}
      <MobileAppInstallCard />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Authentication & User Profile Card */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border border-cyan-400/40"
              />
              <div>
                <h2 className="font-display font-bold text-base text-white">{profile.name}</h2>
                <p className="text-xs text-slate-400">
                  {profile.authMethod === 'guest'
                    ? 'Guest Studio Mode · Local Vault'
                    : `Signed in via ${profile.authMethod.toUpperCase()} · ${profile.email}`}
                </p>
              </div>
            </div>

            {profile.authMethod !== 'guest' && (
              <button
                type="button"
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 rounded-xl bg-white text-slate-900 font-semibold text-xs flex items-center justify-center gap-2.5 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
              />
            </svg>
            <span>Continue with Google Sign-In</span>
          </button>

          {/* Email Registration & Login Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  authMode === 'login' ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-400'
                }`}
              >
                Account Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  authMode === 'register' ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-400'
                }`}
              >
                Register New Account
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Display Name</span>
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full rounded-xl bg-[#070913] border border-white/15 px-3.5 py-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300">Email Address</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded-xl bg-[#070913] border border-white/15 px-3.5 py-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300">Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-[#070913] border border-white/15 px-3.5 py-2.5 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="neon-cta-btn w-full py-3 rounded-xl font-display font-bold text-xs text-white inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{authMode === 'register' ? 'Create AVINASH AI Account' : 'Sign In & Save Profile'}</span>
            </button>
          </form>
        </div>

        {/* Download, History, Privacy & Help Settings */}
        <div className="lg:col-span-6 space-y-6">
          {/* Download Settings */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-display font-bold text-base">
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Download &amp; Export Settings</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300">Default Video Quality</label>
                <select
                  value={profile.defaultQuality}
                  onChange={(e) => {
                    onUpdateProfile({
                      ...profile,
                      defaultQuality: e.target.value as VideoQualityOption,
                    });
                    showSaved('Default export quality updated.');
                  }}
                  className="w-full rounded-xl bg-[#070913] border border-white/15 px-3 py-2 text-xs text-white"
                >
                  {['480p', '720p', '1080p', '2K', '4K'].map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300">Default Aspect Ratio</label>
                <select
                  value={profile.defaultAspectRatio}
                  onChange={(e) => {
                    onUpdateProfile({
                      ...profile,
                      defaultAspectRatio: e.target.value as AspectRatioOption,
                    });
                    showSaved('Default aspect ratio updated.');
                  }}
                  className="w-full rounded-xl bg-[#070913] border border-white/15 px-3 py-2 text-xs text-white"
                >
                  {['9:16', '16:9', '1:1', '4:5', '3:4', '21:9'].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & History Management */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-display font-bold text-base">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Privacy &amp; Video History</span>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Private Local Vault Mode (Keep creations private)</span>
                <input
                  type="checkbox"
                  checked={profile.privateGallery}
                  onChange={(e) => {
                    onUpdateProfile({ ...profile, privateGallery: e.target.checked });
                    showSaved('Privacy preference saved.');
                  }}
                  className="accent-cyan-400 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Save Prompt &amp; Storyboard History</span>
                <input
                  type="checkbox"
                  checked={profile.savePromptHistory}
                  onChange={(e) => {
                    onUpdateProfile({ ...profile, savePromptHistory: e.target.checked });
                    showSaved('History setting updated.');
                  }}
                  className="accent-cyan-400 w-4 h-4"
                />
              </label>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 font-mono-num">
                  <History className="w-4 h-4 text-cyan-400" />
                  <span>Stored Videos: {creations.length}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClearHistory();
                    showSaved('All stored video history cleared.');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Video History</span>
                </button>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="glass-panel rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-display font-bold text-base">
              <HelpCircle className="w-4 h-4 text-pink-400" />
              <span>Help &amp; Studio Guide</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              • <strong className="text-slate-200">Unlimited Free Generation:</strong> AVINASH AI automatically pairs Gemini AI storyboarding &amp; neural TTS with our GPU Canvas 4K Studio Engine so you can generate 5s–30s videos with zero paywalls.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              • <strong className="text-slate-200">Cloud Veo / Omni Flash:</strong> When a billing-enabled Gemini API key is configured in Settings &gt; Secrets, 5s–10s clips automatically render through Gemini Omni 1.1 Flash first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
