import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRegistrationForm } from './useRegistrationForm.js';

describe('useRegistrationForm', () => {
  describe('초기 상태', () => {
    it('기본 초기값으로 훅이 초기화된다', () => {
      const { result } = renderHook(() => useRegistrationForm());

      expect(result.current.formData).toEqual({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      expect(result.current.errors).toEqual({});
      expect(result.current.fieldValidation).toEqual({});
      expect(result.current.isSubmitting).toBe(false);
    });

    it('커스텀 초기값으로 훅이 초기화된다', () => {
      const initialValues = {
        name: '김철수',
        email: 'test@example.com',
        password: '',
        confirmPassword: ''
      };

      const { result } = renderHook(() => useRegistrationForm({
        initialValues
      }));

      expect(result.current.formData).toEqual(initialValues);
    });
  });

  describe('필드 업데이트', () => {
    it('updateField로 특정 필드를 업데이트할 수 있다', () => {
      const { result } = renderHook(() => useRegistrationForm());

      act(() => {
        result.current.updateField('name', '김철수');
      });

      expect(result.current.formData.name).toBe('김철수');
    });

    it('handleInputChange로 input 이벤트를 처리할 수 있다', () => {
      const { result } = renderHook(() => useRegistrationForm());

      const mockEvent = {
        target: {
          name: 'email',
          value: 'test@example.com'
        }
      };

      act(() => {
        result.current.handleInputChange(mockEvent);
      });

      expect(result.current.formData.email).toBe('test@example.com');
    });
  });

  describe('실시간 밸리데이션', () => {
    it('실시간 밸리데이션이 활성화된 경우 필드 밸리데이션이 실행된다', () => {
      const { result } = renderHook(() => useRegistrationForm({
        enableRealTimeValidation: true
      }));

      act(() => {
        result.current.updateField('name', 'a'); // 너무 짧은 이름
      });

      expect(result.current.fieldValidation.name).toEqual({
        isValid: false,
        message: '이름은 2글자 이상이어야 합니다.'
      });
      expect(result.current.getFieldClass('name')).toBe('invalid');
      expect(result.current.getErrorMessage('name')).toBe('이름은 2글자 이상이어야 합니다.');
    });

    it('실시간 밸리데이션이 비활성화된 경우 필드 밸리데이션이 실행되지 않는다', () => {
      const { result } = renderHook(() => useRegistrationForm({
        enableRealTimeValidation: false
      }));

      act(() => {
        result.current.updateField('name', 'a');
      });

      expect(result.current.fieldValidation.name).toBeUndefined();
    });

    it('유효한 값 입력 시 valid 상태가 된다', () => {
      const { result } = renderHook(() => useRegistrationForm());

      act(() => {
        result.current.updateField('name', '김철수');
      });

      expect(result.current.fieldValidation.name).toEqual({
        isValid: true,
        message: ''
      });
      expect(result.current.getFieldClass('name')).toBe('valid');
      expect(result.current.getErrorMessage('name')).toBe('');
    });
  });

  describe('비밀번호 확인 연동', () => {
    it('비밀번호 변경 시 비밀번호 확인도 다시 검증된다', () => {
      const { result } = renderHook(() => useRegistrationForm());

      act(() => {
        result.current.updateField('password', 'Password123!');
        result.current.updateField('confirmPassword', 'Password123!');
      });

      // 비밀번호를 다른 값으로 변경
      act(() => {
        result.current.updateField('password', 'NewPassword123!');
      });

      expect(result.current.fieldValidation.confirmPassword).toEqual({
        isValid: false,
        message: '비밀번호가 일치하지 않습니다.'
      });
    });
  });

  describe('폼 제출', () => {
    it('유효한 폼 데이터로 제출 시 성공 콜백이 호출된다', async () => {
      const onSuccess = vi.fn();
      const { result } = renderHook(() => useRegistrationForm({ onSuccess }));

      // 유효한 데이터 입력
      act(() => {
        result.current.updateField('name', '김철수');
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('password', 'Password123!');
        result.current.updateField('confirmPassword', 'Password123!');
      });

      const mockEvent = { preventDefault: vi.fn() };

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(onSuccess).toHaveBeenCalledWith({
        name: '김철수',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('유효하지 않은 폼 데이터로 제출 시 에러가 설정된다', async () => {
      const { result } = renderHook(() => useRegistrationForm());

      // 유효하지 않은 데이터
      act(() => {
        result.current.updateField('name', 'a'); // 너무 짧음
        result.current.updateField('email', 'invalid'); // 잘못된 형식
      });

      const mockEvent = { preventDefault: vi.fn() };

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(result.current.errors).toHaveProperty('name');
      expect(result.current.errors).toHaveProperty('email');
    });

    it('제출 중 상태가 올바르게 관리된다', async () => {
      const onSuccess = vi.fn(() => new Promise(resolve => setTimeout(resolve, 50)));
      const { result } = renderHook(() => useRegistrationForm({ onSuccess }));

      // 유효한 데이터 입력
      act(() => {
        result.current.updateField('name', '김철수');
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('password', 'Password123!');
        result.current.updateField('confirmPassword', 'Password123!');
      });

      const mockEvent = { preventDefault: vi.fn() };

      // 제출 시작 - Promise를 기다리지 않고 즉시 상태 확인
      let submitPromise;
      act(() => {
        submitPromise = result.current.handleSubmit(mockEvent);
      });

      // 제출 중 상태 확인 (작은 지연 후)
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      // 제출 완료 대기
      await act(async () => {
        await submitPromise;
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('폼 리셋', () => {
    it('resetForm 호출 시 모든 상태가 초기화된다', () => {
      const initialValues = {
        name: 'initial',
        email: 'initial@test.com',
        password: '',
        confirmPassword: ''
      };

      const { result } = renderHook(() => useRegistrationForm({ initialValues }));

      // 데이터 변경
      act(() => {
        result.current.updateField('name', '변경된이름');
        result.current.updateField('email', 'changed@test.com');
      });

      // 리셋
      act(() => {
        result.current.resetForm();
      });

      expect(result.current.formData).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.fieldValidation).toEqual({});
    });
  });

  describe('헬퍼 함수들', () => {
    it('isFormValid가 폼의 유효성을 올바르게 반환한다', () => {
      const { result } = renderHook(() => useRegistrationForm());

      // 초기 상태 (비어있음) - 유효하지 않음
      expect(result.current.isFormValid()).toBe(false);

      // 유효한 데이터 입력
      act(() => {
        result.current.updateField('name', '김철수');
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('password', 'Password123!');
        result.current.updateField('confirmPassword', 'Password123!');
      });

      expect(result.current.isFormValid()).toBe(true);
    });

    it('getErrorMessage가 올바른 에러 메시지를 반환한다', () => {
      const { result } = renderHook(() => useRegistrationForm());

      // 실시간 밸리데이션으로 에러 생성
      act(() => {
        result.current.updateField('name', 'a'); // 너무 짧은 이름
      });

      expect(result.current.getErrorMessage('name')).toBe('이름은 2글자 이상이어야 합니다.');

      // 유효한 값으로 변경
      act(() => {
        result.current.updateField('name', '김철수');
      });

      expect(result.current.getErrorMessage('name')).toBe('');
    });
  });
});
