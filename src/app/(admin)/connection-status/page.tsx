'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

// SMS 로그 타입을 정의합니다.
interface SmsLog {
  id: number;
  sender: string;
  body: string;
  received_at_app: string;
  created_at: string;
}

// 시간 차이를 계산하고 포맷하는 함수
const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)}년 전`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)}달 전`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)}일 전`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)}시간 전`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)}분 전`;
  return `${Math.floor(seconds)}초 전`;
};

// 날짜를 'YYYY-MM-DD HH:mm:ss' 형식으로 포맷하는 함수
const formatDateTime = (dateString: string) => {
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

const ConnectionStatusPage = () => {
  const [logs, setLogs] = useState<SmsLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // 사용자 정보 로딩이 끝나고, 역할이 admin일 때만 로그를 불러옵니다.
    if (!userLoading && user?.role === 'admin') {
      const fetchLogs = async () => {
        try {
          setLoading(true);
          const response = await fetch('/api/sms-logs');
          if (!response.ok) {
            throw new Error('데이터를 불러오는데 실패했습니다.');
          }
          const data = await response.json();
          setLogs(data);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred');
          }
        } finally {
          setLoading(false);
        }
      };

      fetchLogs();
    } else if (!userLoading && user?.role !== 'admin') {
      // 관리자가 아니면 메인 페이지로 리다이렉트합니다.
      router.replace('/');
    }
  }, [user, userLoading, router]);

  const getStatus = () => {
    if (userLoading) {
      return { text: '사용자 확인 중...', color: 'text-gray-500' };
    }
    if (logs.length === 0) {
      return { text: '알 수 없음 (수신된 로그 없음)', color: 'text-gray-500' };
    }
    const lastLogTime = new Date(logs[0].created_at).getTime();
    const now = new Date().getTime();
    const diffInHours = (now - lastLogTime) / (1000 * 60 * 60);

    if (diffInHours > 1) {
      return { text: '불안정 (1시간 이상 통신 없음)', color: 'text-red-500' };
    }
    return { text: '양호', color: 'text-green-500' };
  };

  const status = getStatus();

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">핸드폰 연결 상태</h1>
      
      <div className="my-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex items-center">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">현재 연결 상태:</h2>
          <p className={`ml-2 text-lg font-bold ${status.color}`}>{status.text}</p>
        </div>
        {logs.length > 0 && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            최종 연결 시간: {formatDateTime(logs[0].created_at)} ({timeAgo(logs[0].created_at)})
          </p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">수신된 SMS 로그 (최신 100건)</h2>
        {loading && <p className="mt-4">로딩 중...</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {!loading && !error && (
           <div className="mt-4 flow-root">
             <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
               <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">서버 수신 시간</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">앱 수신 시간</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">발신자</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">메시지 내용</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-6">{formatDateTime(log.created_at)}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDateTime(log.received_at_app)}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{log.sender}</td>
                          <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 break-all">{log.body}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
               </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatusPage; 
