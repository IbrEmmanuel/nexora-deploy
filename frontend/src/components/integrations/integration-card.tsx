'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Settings, Unplug, TestTube2, Clock, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CatalogItem, Connection } from './integrations-dashboard';
import { useState } from 'react';

// SVG logos for each integration
const LOGOS: Record<string, React.ReactNode> = {
  whatsapp: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  stripe: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#635BFF">
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
    </svg>
  ),
  twilio: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#F22F46">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 20.571c-4.731 0-8.571-3.84-8.571-8.571S7.269 3.429 12 3.429s8.571 3.84 8.571 8.571-3.84 8.571-8.571 8.571zm3.429-10.286a1.714 1.714 0 100-3.428 1.714 1.714 0 000 3.428zm0 5.143a1.714 1.714 0 100-3.428 1.714 1.714 0 000 3.428zm-6.858 0a1.714 1.714 0 100-3.428 1.714 1.714 0 000 3.428zm0-5.143a1.714 1.714 0 100-3.428 1.714 1.714 0 000 3.428z"/>
    </svg>
  ),
  hubspot: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#FF7A59">
      <path d="M22.162 5.656a8.384 8.384 0 00-1.119.334 4.573 4.573 0 00-.557-1.681 4.593 4.593 0 00-4.102-2.54 4.6 4.6 0 00-4.6 4.6v.08a8.38 8.38 0 00-3.357 1.67L6.8 6.6a1.86 1.86 0 00.053-.44 1.86 1.86 0 10-1.86 1.86c.24 0 .468-.047.68-.13l1.6 1.6a8.38 8.38 0 00-1.67 5.04 8.4 8.4 0 008.4 8.4 8.4 8.4 0 008.4-8.4 8.38 8.38 0 00-1.67-5.04l1.6-1.6c.212.083.44.13.68.13a1.86 1.86 0 001.86-1.86 1.86 1.86 0 00-1.86-1.86 1.86 1.86 0 00-.84.196zM14 18.4a4.4 4.4 0 110-8.8 4.4 4.4 0 010 8.8z"/>
    </svg>
  ),
  salesforce: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#00A1E0">
      <path d="M10.002 6.204a4.8 4.8 0 013.43-1.43 4.84 4.84 0 014.15 2.37 5.97 5.97 0 011.9-.31 6.01 6.01 0 016.01 6.01 6.01 6.01 0 01-6.01 6.01H5.99a5.99 5.99 0 01-.42-11.97 4.8 4.8 0 014.43-2.68z"/>
    </svg>
  ),
  slack: (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z" fill="#4A154B"/>
    </svg>
  ),
  aws: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#FF9900">
      <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 01-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 01-.287-.375 6.18 6.18 0 01-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 01-.28.104.488.488 0 01-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 01.224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 011.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 00-.735-.136 6.02 6.02 0 00-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.063-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 01-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 01.32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 01.311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 01-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 01-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 01-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 00.415-.758.777.777 0 00-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 01-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 01.24.2.43.43 0 01.071.263v.375c0 .168-.064.256-.184.256a.83.83 0 01-.303-.096 3.652 3.652 0 00-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.743.167-1.158.167z"/>
    </svg>
  ),
  plaid: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#00C853">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 17.25l-4.5-4.5 1.5-1.5 3 3 6-6 1.5 1.5-7.5 7.5z"/>
    </svg>
  ),
};

interface IntegrationCardProps {
  item: CatalogItem;
  connection?: Connection;
  index: number;
  onConfigure: () => void;
  onDisconnect: () => void;
  onTest: () => Promise<void>;
}

export function IntegrationCard({ item, connection, index, onConfigure, onDisconnect, onTest }: IntegrationCardProps) {
  const [testing, setTesting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const status = connection?.status ?? 'disconnected';
  const isConnected = status === 'connected';
  const isError = status === 'error';

  const statusConfig = {
    connected: { label: 'Connected', icon: CheckCircle2, cls: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' },
    disconnected: { label: 'Available', icon: XCircle, cls: 'bg-muted border-border text-muted-foreground' },
    error: { label: 'Error', icon: AlertCircle, cls: 'bg-red-500/10 border-red-500/20 text-red-500' },
  }[status];

  const handleTest = async () => {
    setTesting(true);
    try { await onTest(); } finally { setTesting(false); }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try { await onDisconnect(); } finally { setDisconnecting(false); }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04 }}
      className={cn(
        'rounded-xl border bg-card p-5 flex flex-col gap-3 transition-all hover:shadow-md',
        isConnected ? 'border-emerald-500/20 hover:border-emerald-500/40' :
        isError ? 'border-red-500/20 hover:border-red-500/40' :
        'border-border hover:border-indigo-500/20',
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted/50">
          {LOGOS[item.id] ?? <span className="text-2xl">{item.category[0]}</span>}
        </div>
        <span className={cn('flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-medium', statusConfig.cls)}>
          <statusConfig.icon className="w-3 h-3" />
          {statusConfig.label}
        </span>
      </div>

      {/* Info */}
      <div>
        <div className="font-semibold text-sm">{item.name}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">{item.category}</div>
      </div>

      <p className="text-xs text-muted-foreground/70 line-clamp-2 flex-1">{item.description}</p>

      {/* Stats if connected */}
      {isConnected && connection && (
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground border-t border-border pt-2">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            {connection.totalCalls.toLocaleString()} calls
          </span>
          {connection.lastTestedAt && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Tested {new Date(connection.lastTestedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      )}

      {/* Error message */}
      {isError && connection?.lastError && (
        <div className="text-[11px] text-red-400 bg-red-500/5 border border-red-500/10 rounded-lg px-2 py-1.5 line-clamp-2">
          {connection.lastError}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        {isConnected ? (
          <>
            <button
              onClick={handleTest}
              disabled={testing}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-muted transition-colors text-muted-foreground disabled:opacity-50"
            >
              <TestTube2 className={cn('w-3 h-3', testing && 'animate-pulse')} />
              {testing ? 'Testing…' : 'Test'}
            </button>
            <button
              onClick={onConfigure}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 transition-colors"
            >
              <Settings className="w-3 h-3" />
              Configure
            </button>
            <button
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="p-1.5 rounded-lg text-xs border border-border hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-muted-foreground transition-colors disabled:opacity-50"
              title="Disconnect"
            >
              <Unplug className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <button
            onClick={onConfigure}
            className="w-full py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Connect
          </button>
        )}
      </div>
    </motion.div>
  );
}
