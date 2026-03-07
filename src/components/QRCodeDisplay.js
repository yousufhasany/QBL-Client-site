'use client';

import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeDisplay({ url }) {
  return (
    <div className="glass-card rounded-2xl p-8 flex flex-col items-center gap-4">
      <div className="bg-white p-4 rounded-2xl shadow-inner">
        <QRCodeSVG value={url} size={200} fgColor="#667eea" />
      </div>
      <p className="text-xs text-gray-400 break-all text-center max-w-xs font-mono bg-gray-50 px-3 py-2 rounded-lg">
        {url}
      </p>
      <p className="text-sm text-purple-600 font-semibold">Scan to join the session</p>
    </div>
  );
}
