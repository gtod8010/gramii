'use client';

import React, { useState, useEffect, useCallback, ChangeEvent, useMemo } from 'react';
import { useForm, Controller, FieldErrors, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { useDebounce } from '@/hooks/useDebounce';
import { XCircleIcon } from '@heroicons/react/24/solid';

// Category 인터페이스 (manage-services/page.tsx와 동일하게 정의 또는 임포트)
interface Category {
  id: number;
  name: string;
  description?: string | null;
}

// Service 인터페이스 (manage-services/page.tsx 에서 가져오거나 여기서도 정의)
interface Service {
  id: number;
  name: string;
  service_type_id: number;
  category_id?: number; 
  description?: string | null;
  price_per_unit?: number | undefined;
  min_order_quantity?: number | undefined;
  max_order_quantity?: number | undefined;
  is_active: boolean;
  service_type_name?: string; 
  category_name?: string; 
  created_at?: string; // 추가 (정렬 및 표시에 사용될 수 있음)
  updated_at?: string; // 추가
  special_id?: number | null; // 스페셜 기능 관련 필드는 유지 (다른 모달에서 사용)
  special_name?: string | null; // 스페셜 기능 관련 필드는 유지
  external_id?: string | null;
}

interface ServiceType { // 서비스 타입 인터페이스 정의
  id: number;
  name: string;
  category_id: number;
}

// Realsite에서 가져온 서비스 정보를 위한 인터페이스
interface RealSiteService {
  realsite_service_id: number;
  name: string;
  min_order: number;
  max_order: number;
  rate: number;
  category: string;
}

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceUpdated: () => void; // handleServiceAdded에서 이름 변경
  editingService: Service | null;
  categories: Category[];
}

// Zod 스키마를 컴포넌트 외부에서 내부로 이동시켜, selectedRealSiteService 상태에 접근할 수 있도록 합니다.
// const serviceSchema = z.object({ ... }); // 이 부분은 삭제됩니다.

const NewServiceModal: React.FC<NewServiceModalProps> = ({
  isOpen,
  onClose,
  onServiceUpdated,
  editingService,
  categories,
}) => {
  // 1. 상태 선언 (State declarations)
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [realSiteSearchTerm, setRealSiteSearchTerm] = useState('');
  const [realSiteServices, setRealSiteServices] = useState<RealSiteService[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRealSiteService, setSelectedRealSiteService] = useState<RealSiteService | null>(null);
  
  // 2. 디바운스 훅 (Debounce hook)
  const debouncedSearchTerm = useDebounce(realSiteSearchTerm, 500);

  // 3. Zod 스키마 동적 생성 (Dynamic Zod schema)
  const serviceSchema = useMemo(() => {
    return z.object({
      category_id: z.string().min(1, '카테고리를 선택해주세요.'),
      service_type_id: z.string().min(1, '서비스 타입을 선택해주세요.'),
      service_name: z.string().min(1, '서비스명은 필수입니다.'),
      price_per_unit: z.coerce.number({ invalid_type_error: '가격을 숫자로 입력해주세요.' }).min(0, '가격은 0 이상이어야 합니다.'),
      min_order_quantity: z.coerce.number({ invalid_type_error: '최소 주문 수량을 숫자로 입력해주세요.' }).int('정수만 입력 가능합니다.').min(0, '최소 주문 수량은 0 이상이어야 합니다.'),
      max_order_quantity: z.coerce.number({ invalid_type_error: '최대 주문 수량을 숫자로 입력해주세요.' }).int('정수만 입력 가능합니다.').min(0, '최대 주문 수량은 0 이상이어야 합니다.'),
      description: z.string().optional(),
      external_id: z.string().optional(),
    }).superRefine((data, ctx) => {
      // 값을 문자열로 변환 후 다시 숫자로 파싱하여 안정적으로 비교합니다.
      // 이렇게 하면 한쪽 필드가 비어있을 때(NaN) 불필요한 오류가 발생하는 것을 막을 수 있습니다.
      const min = parseInt(String(data.min_order_quantity), 10);
      const max = parseInt(String(data.max_order_quantity), 10);

      // 두 필드가 모두 유효한 숫자인 경우에만 최소/최대 관계를 검사합니다.
      if (!isNaN(min) && !isNaN(max) && min > max) {
        ctx.addIssue({ code: 'custom', message: '최소 주문 수량은 최대 주문 수량보다 클 수 없습니다.', path: ['min_order_quantity'] });
      }

      // Realsite 서비스가 선택된 경우, Realsite의 제약 조건도 함께 검사합니다.
      if (selectedRealSiteService) {
        if (data.price_per_unit < selectedRealSiteService.rate) {
          ctx.addIssue({ code: 'custom', message: `가격은 Realsite 원가(${selectedRealSiteService.rate}원) 이상이어야 합니다.`, path: ['price_per_unit'] });
        }
        if (!isNaN(min) && min < selectedRealSiteService.min_order) {
          ctx.addIssue({ code: 'custom', message: `최소 주문 수량은 Realsite의 최소 수량(${selectedRealSiteService.min_order}) 이상이어야 합니다.`, path: ['min_order_quantity'] });
        }
        if (!isNaN(max) && max > selectedRealSiteService.max_order) {
          ctx.addIssue({ code: 'custom', message: `최대 주문 수량은 Realsite의 최대 수량(${selectedRealSiteService.max_order})을 초과할 수 없습니다.`, path: ['max_order_quantity'] });
        }
      }
    });
  }, [selectedRealSiteService]);

  // 4. 폼 데이터 타입 (Form data type)
  type ServiceFormData = z.infer<typeof serviceSchema>;

  // 5. useForm 훅 (useForm hook)
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      category_id: '',
      service_type_id: '',
      service_name: '',
      price_per_unit: 0,
      min_order_quantity: 0,
      max_order_quantity: 0,
      description: '',
      external_id: '',
    },
  });
  
  // 6. 폼 값 감시 (Watch form value)
  const watchedCategoryId = watch('category_id');

  // 7. 핸들러 및 이펙트 훅 (Handlers and Effect hooks)
  
  // Realsite 서비스 검색
  useEffect(() => {
    if (debouncedSearchTerm && !editingService) {
      setIsSearching(true);
      fetch(`/api/realsite-services?query=${debouncedSearchTerm}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setRealSiteServices(data);
          }
        })
        .finally(() => setIsSearching(false));
    } else {
      setRealSiteServices([]);
    }
  }, [debouncedSearchTerm, editingService]);

  // Realsite 서비스 선택
  const handleSelectRealSiteService = (service: RealSiteService) => {
    setSelectedRealSiteService(service);
    setValue('service_name', service.name, { shouldDirty: true, shouldValidate: true });
    setValue('price_per_unit', service.rate, { shouldDirty: true, shouldValidate: true });
    setValue('min_order_quantity', service.min_order, { shouldDirty: true, shouldValidate: true });
    setValue('max_order_quantity', service.max_order, { shouldDirty: true, shouldValidate: true });
    setValue('external_id', String(service.realsite_service_id), { shouldDirty: true });

    setRealSiteSearchTerm('');
    setRealSiteServices([]);
  };

  // Realsite 서비스 선택 해제
  const handleDeselectRealSiteService = () => {
    setSelectedRealSiteService(null);
    setValue('service_name', '', { shouldDirty: true, shouldValidate: true });
    setValue('price_per_unit', 0, { shouldDirty: true, shouldValidate: true });
    setValue('min_order_quantity', 0, { shouldDirty: true, shouldValidate: true });
    setValue('max_order_quantity', 0, { shouldDirty: true, shouldValidate: true });
    setValue('external_id', '', { shouldDirty: true });
  };

  // 카테고리에 따른 서비스 타입 로드
  const fetchServiceTypes = useCallback(async (categoryId: string) => {
    if (!categoryId) {
      setServiceTypes([]);
      return;
    }
    try {
      const response = await fetch(`/api/service-types?categoryId=${categoryId}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setServiceTypes(data);
    } catch (error) {
      console.error('Error fetching service types:', error);
      setServiceTypes([]);
    }
  }, []);

  useEffect(() => {
    if (watchedCategoryId) {
      fetchServiceTypes(watchedCategoryId);
    }
  }, [watchedCategoryId, fetchServiceTypes]);

  // 모달 오픈 시 (수정/새 서비스) 폼 상태 설정
  useEffect(() => {
    if (editingService) {
      setValue('category_id', ''); 
      setValue('service_type_id', String(editingService.service_type_id));
      setValue('service_name', editingService.name);
      setValue('price_per_unit', editingService.price_per_unit || 0);
      setValue('min_order_quantity', editingService.min_order_quantity || 0);
      setValue('max_order_quantity', editingService.max_order_quantity || 0);
      setValue('description', editingService.description || '');
      setValue('external_id', editingService.external_id || '');
    } else {
      reset();
      setSelectedRealSiteService(null);
    }
  }, [editingService, reset, setValue]);

  // 폼 제출 핸들러
  const onSubmit: SubmitHandler<ServiceFormData> = async (data) => {
    const apiEndpoint = editingService ? `/api/services/${editingService.id}` : '/api/services';
    const method = editingService ? 'PUT' : 'POST';

    const body = {
      ...data,
      category_id: parseInt(data.category_id),
      service_type_id: parseInt(data.service_type_id),
    };

    try {
      const response = await fetch(apiEndpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '서비스 저장에 실패했습니다.');
      }
      
      onServiceUpdated();
      onClose();
    } catch (error) {
      console.error('Error submitting service:', error);
      alert(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  // 유효성 검사 실패 핸들러
  const onInvalid = (errors: FieldErrors<ServiceFormData>) => {
    console.error("폼 유효성 검사 실패:", errors);
    const messages = Object.values(errors).map(e => e.message).join('\n');
    alert(`입력 내용을 다시 확인해주세요.\n${messages}`);
  };

  const categoryOptions = categories.map(cat => ({ value: String(cat.id), label: cat.name }));
  const serviceTypeOptions = serviceTypes.map(type => ({ value: String(type.id), label: type.name }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingService ? '서비스 수정' : '새 서비스 추가'} className="max-w-2xl max-h-[85vh] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4 p-6">
        
        {!editingService && (
          <div className="relative">
            <Label htmlFor="realsite-search">Realsite 서비스 검색</Label>
            <Input
              id="realsite-search"
              placeholder="등록할 Realsite 서비스 이름 또는 ID 검색..."
              value={realSiteSearchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setRealSiteSearchTerm(e.target.value)}
              disabled={!!selectedRealSiteService}
            />
            {isSearching && <p className="text-sm text-slate-500 mt-1">검색 중...</p>}
            {realSiteServices.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {realSiteServices.map(service => (
                  <li
                    key={service.realsite_service_id}
                    onClick={() => handleSelectRealSiteService(service)}
                    className="px-4 py-3 hover:bg-slate-100 cursor-pointer border-b last:border-b-0"
                  >
                    <p className="font-semibold text-slate-800">{service.name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      ID: {service.realsite_service_id} | 카테고리: {service.category} | 최소: {service.min_order} / 최대: {service.max_order}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {selectedRealSiteService && (
          <div className="p-4 border rounded-md bg-slate-50 relative">
            <button
              type="button"
              onClick={handleDeselectRealSiteService}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
            <h3 className="font-semibold text-slate-800 mb-2">Realsite 서비스 정보</h3>
            <p className="text-sm text-slate-600"><b>서비스명:</b> {selectedRealSiteService.name}</p>
            <p className="text-sm text-slate-600"><b>ID:</b> {selectedRealSiteService.realsite_service_id}</p>
            <p className="text-sm text-slate-600"><b>원가:</b> {selectedRealSiteService.rate}원</p>
            <p className="text-sm text-slate-600"><b>최소/최대 주문:</b> {selectedRealSiteService.min_order} / {selectedRealSiteService.max_order}</p>
          </div>
        )}
        
        <div>
          <Label htmlFor="category_id">카테고리</Label>
          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={categoryOptions}
                placeholder="카테고리 선택"
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
          {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message}</p>}
        </div>

        <div>
          <Label htmlFor="service_type_id">서비스 타입</Label>
          <Controller
            name="service_type_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={serviceTypeOptions}
                placeholder="서비스 타입 선택"
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
          {errors.service_type_id && <p className="text-red-500 text-sm">{errors.service_type_id.message}</p>}
        </div>

        <div>
          <Label htmlFor="service_name">서비스명</Label>
          <Controller
            name="service_name"
            control={control}
            render={({ field }) => <Input id="service_name" {...field} />}
          />
          {errors.service_name && <p className="text-red-500 text-sm">{errors.service_name.message}</p>}
        </div>

        <div>
          <Label htmlFor="price_per_unit">1개당 판매 가격 (원)</Label>
          <Controller
            name="price_per_unit"
            control={control}
            render={({ field }) => <Input id="price_per_unit" type="number" {...field} />}
          />
          {errors.price_per_unit && <p className="text-red-500 text-sm">{errors.price_per_unit.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="min_order_quantity">최소 주문 수량</Label>
            <Controller
              name="min_order_quantity"
              control={control}
              render={({ field }) => <Input id="min_order_quantity" type="number" {...field} />}
            />
            {errors.min_order_quantity && <p className="text-red-500 text-sm">{errors.min_order_quantity.message}</p>}
          </div>
          <div>
            <Label htmlFor="max_order_quantity">최대 주문 수량</Label>
            <Controller
              name="max_order_quantity"
              control={control}
              render={({ field }) => <Input id="max_order_quantity" type="number" {...field} />}
            />
            {errors.max_order_quantity && <p className="text-red-500 text-sm">{errors.max_order_quantity.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="description">서비스 설명 (선택 사항)</Label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="h-auto min-h-[120px] w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-form-input dark:text-white"
            placeholder="서비스에 대한 상세 설명을 입력하세요."
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" onClick={onClose} variant="outline" disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="primary">
            {isSubmitting ? '저장 중...' : (editingService ? '서비스 수정' : '서비스 추가')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewServiceModal; 
