'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

interface DepositRequest {
  id: number;
  user_name: string;
  user_email: string;
  amount: number;
  depositor_name: string;
  status: 'pending' | 'completed' | 'cancelled';
  receipt_type: 'tax_invoice' | 'cash_receipt' | 'none';
  requested_at: string;
  confirmed_at: string | null;
  account_number: string | null;
  receipt_info: {
    email: string;
    ceoName: string;
    companyName: string;
    contactNumber: string;
    businessNumber: string;
    businessType?: string;
    businessItem?: string;
  } | null;
  is_sms_received: boolean;
  is_tax_invoice_processed: boolean;
}

const statusDisplayNames = {
  pending: '대기중',
  completed: '완료',
  cancelled: '취소',
};

const receiptTypeDisplayNames = {
  tax_invoice: '세금계산서',
  cash_receipt: '현금영수증',
  none: '신청안함',
};

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const RechargeManagementPage = () => {
  const [requests, setRequests] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<DepositRequest | null>(null);
  const [processingRequestId, setProcessingRequestId] = useState<number | null>(null);
  const [showManualCompleteModal, setShowManualCompleteModal] = useState(false);
  const [manualCompleteRequest, setManualCompleteRequest] = useState<DepositRequest | null>(null);
  const [adminMemo, setAdminMemo] = useState('');

  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();

  const fetchDepositRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwtToken');
      const headers = { 'Authorization': `Bearer ${token}` };
      const response = await fetch('/api/recharge-management', { headers });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setRequests(data);
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

  useEffect(() => {
    if (!userLoading && user?.role === 'admin') {
      fetchDepositRequests();
    } else if (!userLoading && user?.role !== 'admin') {
      router.replace('/');
    }
  }, [user, userLoading, router]);

  const handleProcessTaxInvoice = async (requestId: number) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`/api/recharge-management/${requestId}/process-tax-invoice`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '처리 실패');
      }
      
      // 상태를 다시 불러오거나 로컬 상태를 업데이트
      await fetchDepositRequests();
      setSelectedRequest(null); // 모달 닫기

    } catch (error) {
      console.error('Failed to process tax invoice:', error);
      alert(`오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  const handleManualComplete = (request: DepositRequest) => {
    setManualCompleteRequest(request);
    setAdminMemo('');
    setShowManualCompleteModal(true);
  };

  const confirmManualComplete = async () => {
    if (!manualCompleteRequest) return;

    try {
      setProcessingRequestId(manualCompleteRequest.id);
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`/api/recharge-management/${manualCompleteRequest.id}/manual-complete`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminMemo })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '수동 충전 처리 실패');
      }

      const result = await response.json();
      alert(`충전이 완료되었습니다!\n사용자: ${result.userInfo.name}\n충전액: ${manualCompleteRequest.amount.toLocaleString()}원\n새 잔액: ${result.userInfo.newBalance.toLocaleString()}원`);
      
      // 상태를 다시 불러오기
      await fetchDepositRequests();
      
      // 모달 닫기
      setShowManualCompleteModal(false);
      setManualCompleteRequest(null);
      setAdminMemo('');

    } catch (error) {
      console.error('Failed to manually complete recharge:', error);
      alert(`오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setProcessingRequestId(null);
    }
  };

  return (
    <div className="mx-auto max-w-full">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">충전 관리</h1>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">요청시간</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">회원</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">입금자명</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">입금액</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">요청계좌</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">영수증</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">상태</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">처리시간</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                  {loading ? (
                    <tr><td colSpan={9} className="p-4 text-center">로딩 중...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={9} className="p-4 text-center text-red-500">{error}</td></tr>
                  ) : (
                    requests.map((req) => (
                      <tr key={req.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 dark:text-gray-400 sm:pl-6">{formatDateTime(req.requested_at)}</td>
                        <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">{req.user_name} ({req.user_email})</td>
                        <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{req.depositor_name}</td>
                        <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{req.amount.toLocaleString()}원</td>
                        <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{req.account_number || 'N/A'}</td>
                        <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {req.receipt_type === 'tax_invoice' ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedRequest(req)}
                                className="text-blue-600 hover:underline"
                              >
                                세금계산서
                              </button>
                              {req.is_tax_invoice_processed && (
                                <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                  완료
                                </span>
                              )}
                            </div>
                          ) : (
                            receiptTypeDisplayNames[req.receipt_type] || req.receipt_type
                          )}
                        </td>
                        <td className="px-3 py-4 text-sm font-medium">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            req.status === 'completed' ? 'bg-green-100 text-green-800' :
                            req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {statusDisplayNames[req.status] || req.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDateTime(req.confirmed_at)}</td>
                        <td className="px-3 py-4 text-sm font-medium">
                          {req.status === 'pending' ? (
                            <button
                              onClick={() => handleManualComplete(req)}
                              disabled={processingRequestId === req.id}
                              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                                processingRequestId === req.id
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {processingRequestId === req.id ? '처리중...' : '수동완료'}
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 세금계산서 정보 모달 */}
      {selectedRequest && selectedRequest.receipt_info && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">세금계산서 정보</h3>
            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p><strong>상호명:</strong> {selectedRequest.receipt_info.companyName}</p>
              <p><strong>대표자명:</strong> {selectedRequest.receipt_info.ceoName}</p>
              <p><strong>사업자등록번호:</strong> {selectedRequest.receipt_info.businessNumber}</p>
              <p><strong>이메일:</strong> {selectedRequest.receipt_info.email}</p>
              <p><strong>연락처:</strong> {selectedRequest.receipt_info.contactNumber}</p>
              <p><strong>업태:</strong> {selectedRequest.receipt_info.businessType || '-'}</p>
              <p><strong>종목:</strong> {selectedRequest.receipt_info.businessItem || '-'}</p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              {!selectedRequest.is_tax_invoice_processed && (
                 <button
                  onClick={() => handleProcessTaxInvoice(selectedRequest.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  처리완료
                </button>
              )}
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수동 충전 완료 확인 모달 */}
      {showManualCompleteModal && manualCompleteRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">수동 충전 처리 확인</h3>
            
            <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">⚠️ 중요한 작업입니다</p>
                <p className="text-yellow-700 dark:text-yellow-300 text-xs mt-1">
                  실제로 입금이 확인된 후에만 수동 완료 처리해주세요.
                </p>
              </div>
              
              <div className="space-y-2">
                <p><strong>회원:</strong> {manualCompleteRequest.user_name} ({manualCompleteRequest.user_email})</p>
                <p><strong>입금자명:</strong> {manualCompleteRequest.depositor_name}</p>
                <p><strong>충전금액:</strong> {manualCompleteRequest.amount.toLocaleString()}원</p>
                <p><strong>요청시간:</strong> {formatDateTime(manualCompleteRequest.requested_at)}</p>
              </div>

              <div className="mt-4">
                <label htmlFor="adminMemo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  관리자 메모 (선택사항)
                </label>
                <textarea
                  id="adminMemo"
                  value={adminMemo}
                  onChange={(e) => setAdminMemo(e.target.value)}
                  placeholder="수동 처리 사유나 확인 내용을 기록해주세요..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowManualCompleteModal(false);
                  setManualCompleteRequest(null);
                  setAdminMemo('');
                }}
                disabled={processingRequestId !== null}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={confirmManualComplete}
                disabled={processingRequestId !== null}
                className={`px-4 py-2 rounded-md font-medium ${
                  processingRequestId !== null
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {processingRequestId !== null ? '처리 중...' : '충전 처리 확정'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RechargeManagementPage; 
