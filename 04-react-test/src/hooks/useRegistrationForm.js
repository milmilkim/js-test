import { useState, useCallback } from 'react';
import { validators, validateForm } from '../utils/validation.js';

/**
 * 회원가입 폼 로직을 관리하는 Custom Hook (Vue의 컴포저블과 유사)
 * @param {object} options - 설정 옵션
 * @param {function} options.onSuccess - 성공 콜백
 * @param {object} options.initialValues - 초기값
 * @param {boolean} options.enableRealTimeValidation - 실시간 밸리데이션 활성화 여부
 */
export const useRegistrationForm = (options = {}) => {
  const {
    onSuccess,
    initialValues = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    enableRealTimeValidation = true
  } = options;

  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [fieldValidation, setFieldValidation] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 입력값 변경 처리
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 실시간 밸리데이션이 활성화된 경우에만
    if (enableRealTimeValidation) {
      validateField(name, value);
    }
  }, [enableRealTimeValidation]);

  /**
   * 개별 필드 밸리데이션
   */
  const validateField = useCallback((fieldName, value) => {
    let result;
    
    switch (fieldName) {
      case 'name':
        result = validators.validateName(value.trim());
        break;
      case 'email':
        result = validators.validateEmail(value.trim());
        break;
      case 'password':
        result = validators.validatePassword(value.trim());
        // 비밀번호가 변경되면 비밀번호 확인도 다시 검사
        if (formData.confirmPassword) {
          const confirmResult = validators.validatePasswordConfirm(value.trim(), formData.confirmPassword.trim());
          setFieldValidation(prev => ({
            ...prev,
            confirmPassword: confirmResult
          }));
        }
        break;
      case 'confirmPassword':
        result = validators.validatePasswordConfirm(formData.password.trim(), value.trim());
        break;
      default:
        return;
    }

    setFieldValidation(prev => ({
      ...prev,
      [fieldName]: result
    }));
  }, [formData.password, formData.confirmPassword]);

  /**
   * 폼 제출 처리
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim()
    };

    const validation = validateForm(trimmedData);

    if (validation.isValid) {
      try {
        // 성공 콜백 실행
        if (onSuccess) {
          await onSuccess(trimmedData);
        }
        
        setErrors({});
        resetForm();
      } catch (error) {
        console.error('폼 제출 중 오류:', error);
        setErrors({ submit: '제출 중 오류가 발생했습니다.' });
      }
    } else {
      setErrors(validation.errors);
    }
    
    setIsSubmitting(false);
  }, [formData, onSuccess]);

  /**
   * 폼 리셋
   */
  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setFieldValidation({});
  }, [initialValues]);

  /**
   * 필드 상태 클래스 결정
   */
  const getFieldClass = useCallback((fieldName) => {
    const validation = fieldValidation[fieldName];
    if (!validation) return '';
    return validation.isValid ? 'valid' : 'invalid';
  }, [fieldValidation]);

  /**
   * 에러 메시지 표시
   */
  const getErrorMessage = useCallback((fieldName) => {
    if (errors[fieldName]) return errors[fieldName];
    const validation = fieldValidation[fieldName];
    if (validation && !validation.isValid) return validation.message;
    return '';
  }, [errors, fieldValidation]);

  /**
   * 특정 필드 값 업데이트
   */
  const updateField = useCallback((fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    if (enableRealTimeValidation) {
      validateField(fieldName, value);
    }
  }, [enableRealTimeValidation, validateField]);

  /**
   * 폼 전체 유효성 검사
   */
  const isFormValid = useCallback(() => {
    const validation = validateForm(formData);
    return validation.isValid;
  }, [formData]);

  return {
    // 상태
    formData,
    errors,
    fieldValidation,
    isSubmitting,
    
    // 액션
    handleInputChange,
    handleSubmit,
    resetForm,
    updateField,
    validateField,
    
    // 헬퍼
    getFieldClass,
    getErrorMessage,
    isFormValid
  };
};
