import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../components/ui/Toast';
import { formatDate } from '@skylite/shared';
import type { AuditLogDTO } from '@skylite/shared';
import { ScrollText, ShieldAlert, User, Clock } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLogDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getAuditLogs();
        setLogs(data.logs);
      } catch (err: any) {
        toast('error', 'Failed to load audit trail');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">System Audit Logs</h1>
        <p className="text-gray-400 text-sm">Immutable security trail tracking all staff and administrator actions</p>
      </div>

      <div className="bg-brand-dark border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-darker border-b border-gray-800 uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Admin / Operator</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Entity & Target</th>
                <th className="px-6 py-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    No audit records logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-gray-400 font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      {new Date(log.createdAt).toLocaleString('en-IN')}
                    </td>

                    <td className="px-6 py-4 font-medium text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-brand-gold" />
                      {(log as any).admin?.name || (log as any).admin?.email || log.adminId}
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-brand-gold/10 border border-brand-gold/30 text-brand-gold px-2 py-0.5 rounded font-mono font-bold text-[11px]">
                        {log.action}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      <span className="font-semibold text-white">{log.entityType}</span>{' '}
                      <span className="text-gray-500 font-mono text-[11px]">({log.entityId})</span>
                    </td>

                    <td className="px-6 py-4 text-gray-500 font-mono text-[11px]">
                      {log.ipAddress || 'Internal / Local'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;