'use client';

import React, { useState } from 'react';
import { UploadCloud, Tv, CheckCircle2, Copy, AlertCircle, FileArchive } from 'lucide-react';

interface UploadResult {
  code: string;
  tvDisplayUrl: string;
  fileName: string;
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al subir');

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="p-3 bg-indigo-600 rounded-2xl">
          <Tv className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">TVDrop</h1>
          <p className="text-slate-400 text-xs">Envía APKs a tu Android TV</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleUpload} className="space-y-5">
          <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 transition">
            <div className="flex flex-col items-center justify-center text-center px-4">
              {file ? (
                <>
                  <FileArchive className="w-10 h-10 text-indigo-400 mb-2" />
                  <p className="text-sm font-medium text-slate-200 break-all">{file.name}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                  <p className="text-sm text-indigo-400 font-semibold">Toca aquí para elegir archivo</p>
                  <p className="text-xs text-slate-500 mt-1">.APK, .APKS, .XAPK, .ZIP, .M3U</p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept=".apk,.apks,.xapk,.zip,.m3u,.m3u8"
              onChange={(e) => {
                setError(null);
                setResult(null);
                if (e.target.files?.[0]) setFile(e.target.files[0]);
              }}
            />
          </label>

          {error && (
            <div className="flex items-center gap-2 text-red-950/40 border border-red-900 p-3 rounded-xl text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition"
          >
            {loading ? 'Subiendo archivo...' : 'Generar código para TV'}
          </button>
        </form>
      </div>

      {result && (
        <div className="mt-6 bg-emerald-950/30 border border-emerald-800 rounded-2xl p-5 text-center">
          <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-medium mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Escribe esto en Downloader en tu TV:</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 my-2 flex items-center justify-between gap-2">
            <code className="text-lg font-mono font-bold text-amber-400 break-all mx-auto">
              {result.tvDisplayUrl}
            </code>
            <button
              onClick={() => copyToClipboard(result.tvDisplayUrl)}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg shrink-0"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied && <p className="text-xs text-emerald-400">¡Copiado!</p>}
        </div>
      )}
    </main>
  );
            }
