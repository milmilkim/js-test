import { useState } from 'react';
import { validators, validateForm } from '../utils/validation.js';
import './RegistrationForm.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [fieldValidation, setFieldValidation] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * 입력값 변경 처리
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 실시간 밸리데이션
    validateField(name, value);
  };

  /**
   * 개별 필드 밸리데이션
   */
  const validateField = (fieldName, value) => {
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
  };

  /**
   * 폼 제출 처리
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim()
    };

    const validation = validateForm(trimmedData);

    if (validation.isValid) {
      console.log('회원가입 성공:', trimmedData);
      setSuccessMessage(`${trimmedData.name}님, 회원가입이 완료되었습니다!`);
      setErrors({});
      
      // 폼 리셋
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setFieldValidation({});
    } else {
      setErrors(validation.errors);
      setSuccessMessage('');
    }
  };

  /**
   * 필드 상태 클래스 결정
   */
  const getFieldClass = (fieldName) => {
    const validation = fieldValidation[fieldName];
    if (!validation) return '';
    return validation.isValid ? 'valid' : 'invalid';
  };

  /**
   * 에러 메시지 표시
   */
  const getErrorMessage = (fieldName) => {
    if (errors[fieldName]) return errors[fieldName];
    const validation = fieldValidation[fieldName];
    if (validation && !validation.isValid) return validation.message;
    return '';
  };

  return (
    <div className="registration-container">
      <h1>간단한 회원가입 폼</h1>
      
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="name">이름:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={getFieldClass('name')}
          />
          <div className="error" data-testid="name-error">
            {getErrorMessage('name')}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={getFieldClass('email')}
          />
          <div className="error" data-testid="email-error">
            {getErrorMessage('email')}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={getFieldClass('password')}
          />
          <div className="error" data-testid="password-error">
            {getErrorMessage('password')}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={getFieldClass('confirmPassword')}
          />
          <div className="error" data-testid="confirmPassword-error">
            {getErrorMessage('confirmPassword')}
          </div>
        </div>
        
        <button type="submit">가입하기</button>
      </form>
      
      {successMessage && (
        <div className="success" data-testid="success-message">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
