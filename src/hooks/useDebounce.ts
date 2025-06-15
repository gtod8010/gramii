import { useState, useEffect } from 'react';

// useDebounce 훅: value가 변경된 후 delay 밀리초 동안 변경이 없으면, 디바운스된 값을 반환
function useDebounce<T>(value: T, delay: number): T {
  // 디바운스된 값을 저장할 상태
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    () => {
      // value가 변경되거나 delay가 변경될 때마다 타이머 설정
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // 다음 effect가 실행되기 전이나 컴포넌트가 언마운트될 때 타이머를 정리
      // 만약 delay 시간 내에 value가 다시 변경되면, 이전 타이머는 취소되고 새 타이머가 설정됨
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // value 또는 delay가 변경될 때만 이 effect를 재실행
  );

  return debouncedValue;
}

export { useDebounce }; 
