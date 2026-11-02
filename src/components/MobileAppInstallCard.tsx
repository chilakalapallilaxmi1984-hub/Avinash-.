import React, { useState } from 'react';
import { Smartphone, Download, Copy, Check, Share, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

export const MobileAppInstallCard: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [showStoreGuide, setShowStoreGuide] = useState(false);

  const liveAppUrl =
    typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-j26mhdhhzfdgbqrnthjqif-124654864531.asia-east1.run.app';

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(liveAppUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore
    }
  };

  return (
    <div className="glass-panel neon-border-glow rounded-2xl p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-white font-display font-bold text-base">
          <Smartphone className="w-5 h-5 text-cyan-400" />
          <span>Install AVINASH AI on Android &amp; iPhone (iOS)</span>
        </div>
        {isInstalled && (
          <span className="text-xs font-semibold text-emerald-300">
            Installed on Device
          </span>
        )}
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        <strong className="text-white">AVINASH AI</strong> is ready as an installable Progressive Web App (PWA).
        Install it directly onto your Android or iPhone home screen right now with one link — or package this URL into a native Play Store (`.aab`) and App Store (`.ipa`) release using PWABuilder.
      </p>

      {/* Shareable Direct App Link */}
      <div className="p-3 rounded-xl bg-[#070913] border border-white/15 flex items-center justify-between gap-3">
        <span className="text-xs font-mono-num text-cyan-300 truncate">{liveAppUrl}</span>
        <button
          type="button"
          onClick={handleCopyUrl}
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy App Link'}</span>
        </button>
      </div>

      {/* Direct Install Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {isInstallable ? (
          <button
            type="button"
            onClick={install}
            className="neon-cta-btn py-3 px-4 rounded-xl font-display font-bold text-xs text-white flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Install App Now (Android / PC)</span>
          </button>
        ) : (
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-xs font-bold text-cyan-300">Android (Chrome)</div>
            <p className="text-[11px] text-slate-300">
              Open the link above in Chrome, tap <strong>⋮ Menu</strong> &rarr;{' '}
              <strong>Install App / Add to Home Screen</strong>.
            </p>
          </div>
        )}

        <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
            <Share className="w-3.5 h-3.5" />
            <span>iPhone &amp; iPad (Safari){isIOS ? ' — Your Device' : ''}</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Open the link in Safari, tap <strong>Share</strong> &rarr;{' '}
            <strong>Add to Home Screen</strong>.
          </p>
        </div>
      </div>

      {/* Play Store & App Store Publishing Toggle */}
      <div className="pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={() => setShowStoreGuide((v) => !v)}
          className="text-xs font-semibold text-cyan-300 hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>
            {showStoreGuide
              ? 'Hide Google Play Store & Apple App Store Publishing Steps'
              : 'How to publish AVINASH AI on Google Play Store & Apple App Store'}
          </span>
        </button>

        {showStoreGuide && (
          <div className="mt-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5 text-xs text-slate-300 leading-relaxed">
            <p>
              Because Apple and Google require developer-owned store accounts ($99/yr Apple Developer Program &amp; $25 Google Play Console) to assign public store URLs, we have already embedded the compliant <strong>Web App Manifest, Service Worker, and 512×512 Maskable Icons</strong> inside AVINASH AI:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li>
                Copy your live AVINASH AI URL above and paste it into <strong>pwabuilder.com</strong> (or wrap with Capacitor).
              </li>
              <li>
                Download the signed <strong>Android App Bundle (`.aab`)</strong> for Google Play Console and the <strong>Xcode iOS package (`.ipa`)</strong> for Apple App Store Connect.
              </li>
              <li>
                Upload to your developer console to receive your official `play.google.com` and `apps.apple.com` store links.
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
