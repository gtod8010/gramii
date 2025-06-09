"use client";

import React, { useState, useEffect } from 'react';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSubmit: (data: any) => void; // 실제 제출 로직은 추후 구현
}

type ReceiptType = 'none' | 'tax_invoice' | 'cash_receipt';

export default function RechargeModal({ isOpen, onClose }: RechargeModalProps) {
  const [amount, setAmount] = useState('');
  const [depositorName, setDepositorName] = useState('');
  const [receiptType, setReceiptType] = useState<ReceiptType>('none');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 세금계산서 필드
  const [companyName, setCompanyName] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [ceoName, setCeoName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');

  // 현금영수증 필드
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setDepositorName('');
      setReceiptType('none');
      setAgreedToTerms(false);
      setCompanyName('');
      setBusinessNumber('');
      setCeoName('');
      setContactNumber('');
      setEmail('');
      setPhoneNumber('');
      setIsSubmitting(false);
      setSubmitError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!amount || !depositorName || !agreedToTerms) {
      alert('필수 항목을 모두 입력하고 약관에 동의해주세요.');
      return;
    }
    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('충전 금액은 0보다 커야 합니다.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/recharge-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
      amount: parsedAmount,
          depositorName: depositorName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '충전 요청에 실패했습니다.');
      }
      alert("입금 신청이 완료되었습니다. 관리자 확인 후 처리됩니다.");
      onClose();
    } catch (error: any) {
      console.error("Recharge request submission error:", error);
      setSubmitError(error.message || '알 수 없는 오류가 발생했습니다.');
      alert(`오류: ${error.message || '알 수 없는 오류가 발생했습니다.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4">
      <div className="relative bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center justify-center bg-pink-100 dark:bg-pink-700 p-3 rounded-md">
            <span className="text-2xl font-bold text-pink-600 dark:text-pink-300">M</span> 
            <span className="ml-2 text-lg font-semibold text-gray-700 dark:text-gray-200">gramii</span>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-6">무통장입금 충전 신청</h2>

        <div className="mb-6 p-4 border border-blue-200 dark:border-blue-700 rounded-md bg-blue-50 dark:bg-blue-900/30">
          <h3 className="text-md font-semibold text-blue-700 dark:text-blue-300 mb-2">입금 계좌 안내</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300"><strong>은행:</strong> KB 국민은행</p>
          <p className="text-sm text-gray-700 dark:text-gray-300"><strong>계좌번호:</strong> 444401-01-499150</p>
          <p className="text-sm text-gray-700 dark:text-gray-300"><strong>예금주:</strong> 김수민(그래미)</p>
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">※ 입금 시 입금자명과 신청서에 작성하신 입금자명이 반드시 동일해야 합니다.</p>
        </div>

        <div className="space-y-4 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label htmlFor="amount" className={labelClass}>충전 금액을 입력해주세요.</label>
            <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} placeholder="0" disabled={isSubmitting} />
          </div>
          <div>
            <label htmlFor="depositorName" className={labelClass}>입금자명을 입력해주세요.</label>
            <input type="text" id="depositorName" value={depositorName} onChange={(e) => setDepositorName(e.target.value)} className={inputClass} disabled={isSubmitting} />
          </div>

          <fieldset className="mt-4">
            <legend className="sr-only">영수증 종류</legend>
            <div className="flex flex-wrap items-center justify-start sm:justify-between gap-x-4 gap-y-2">
              {(['none', 'tax_invoice', 'cash_receipt'] as ReceiptType[]).map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    id={type}
                    name="receiptType"
                    type="radio"
                    checked={receiptType === type}
                    onChange={() => setReceiptType(type)}
                    disabled={type !== 'none' || isSubmitting}
                    className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-indigo-600 ${(type !== 'none' || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  <label htmlFor={type} className={`ml-2 block text-sm text-gray-700 dark:text-gray-300 ${(type !== 'none' || isSubmitting) ? 'opacity-50' : ''}`}>
                    {type === 'none' ? '선택안함' : type === 'tax_invoice' ? '세금계산서' : '현금영수증'}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>

          {receiptType === 'tax_invoice' && (
            <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md space-y-4">
              <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">세금계산서 정보</h3>
              <div>
                <label htmlFor="companyName" className={labelClass}>회사명</label>
                <input type="text" id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="businessNumber" className={labelClass}>사업자번호</label>
                <input type="text" id="businessNumber" value={businessNumber} onChange={(e) => setBusinessNumber(e.target.value)} className={inputClass} placeholder="'-' 없이 숫자만 입력" />
              </div>
              <div>
                <label htmlFor="ceoName" className={labelClass}>대표자</label>
                <input type="text" id="ceoName" value={ceoName} onChange={(e) => setCeoName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="contactNumber" className={labelClass}>연락처</label>
                <input type="tel" id="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className={inputClass} placeholder="'-' 없이 숫자만 입력" />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>이메일 (세금계산서 수신)</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="example@example.com" />
              </div>
            </div>
          )}

          {receiptType === 'cash_receipt' && (
            <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md space-y-4">
               <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">현금영수증 정보</h3>
              <div>
                <label htmlFor="phoneNumber" className={labelClass}>전화번호</label>
                <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={inputClass} placeholder="'-' 없이 숫자만 입력" />
              </div>
            </div>
          )}

          <div className="flex items-start mt-6">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={isSubmitting}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
                입금을 신청하실 경우 이용약관에 동의하는 것으로 간주되는 것을 확인하였습니다.
              </label>
            </div>
          </div>

          {submitError && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center">오류: {submitError}</p>
          )}
        </div>

        <div className="mt-6 sm:mt-8 space-y-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:bg-slate-600 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '처리 중...' : '입금 신청 (평균 1분 이내 자동 처리)'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full flex justify-center py-2.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소하고 나가기
          </button>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <span className="sr-only">닫기</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>
    </div>
  );
} 
