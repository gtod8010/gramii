'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

interface SmsLog {
  id: number;
  sender: string;
  body: string;
  received_at_app: string;
  created_at: string;
}

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

const SmsLogsPage = () => {
  const [logs, setLogs] = useState<SmsLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwtToken');
        const headers = { 'Authorization': `Bearer ${token}` };
        const response = await fetch('/api/sms-logs', { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setLogs(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading && user?.role === 'admin') {
      fetchLogs();
    } else if (!userLoading && user?.role !== 'admin') {
      router.replace('/');
    }
  }, [user, userLoading, router]);

  return (
    <div className="mx-auto max-w-full">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">SMS 수신 로그</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        안드로이드 앱에서 수신된 모든 SMS 기록입니다. 최신 200개까지 표시됩니다.
      </p>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="w-1/12 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">ID</th>
                    <th scope="col" className="w-2/12 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">수신 시간(앱)</th>
                    <th scope="col" className="w-2/12 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">발신자</th>
                    <th scope="col" className="w-7/12 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">내용</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                  {loading ? (
                    <tr><td colSpan={4} className="p-4 text-center">로딩 중...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={4} className="p-4 text-center text-red-500">{error}</td></tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 dark:text-gray-400 sm:pl-6">{log.id}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDateTime(log.received_at_app)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white">{log.sender}</td>
                        <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400"><pre className="whitespace-pre-wrap font-sans">{log.body}</pre></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsLogsPage; 
