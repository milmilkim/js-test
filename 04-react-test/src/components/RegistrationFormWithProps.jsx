import { useRegistrationForm } from '../hooks/useRegistrationForm.js';
import './RegistrationForm.css';

/**
 * Props를 받는 회원가입 폼 컴포넌트
 * @param {object} props
 * @param {string} props.title - 폼 제목
 * @param {object} props.initialValues - 초기값
 * @param {function} props.onSuccess - 성공 콜백
 * @param {function} props.onError - 에러 콜백
 * @param {boolean} props.enableRealTimeValidation - 실시간 밸리데이션 활성화 여부
 * @param {boolean} props.disabled - 폼 비활성화 여부
 * @param {string} props.submitButtonText - 제출 버튼 텍스트
 * @param {array} props.hiddenFields - 숨길 필드 목록
 * @param {object} props.fieldLabels - 필드 라벨 커스터마이징
 * @param {string} props.className - 추가 CSS 클래스
 */
const RegistrationFormWithProps = ({
  title = '간단한 회원가입 폼',
  initialValues,
  onSuccess,
  onError,
  enableRealTimeValidation = true,
  disabled = false,
  submitButtonText = '가입하기',
  hiddenFields = [],
  fieldLabels = {
    name: '이름:',
    email: '이메일:',
    password: '비밀번호:',
    confirmPassword: '비밀번호 확인:'
  },
  className = '',
  successMessage,
  showSuccessMessage = true
}) => {
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    getFieldClass,
    getErrorMessage
  } = useRegistrationForm({
    initialValues,
    enableRealTimeValidation,
    onSuccess: async (data) => {
      try {
        if (onSuccess) {
          await onSuccess(data);
        }
      } catch (error) {
        if (onError) {
          onError(error);
        }
      }
    }
  });

  const isFieldVisible = (fieldName) => !hiddenFields.includes(fieldName);

  return (
    <div className={`registration-container ${className}`}>
      <h1>{title}</h1>
      
      <form onSubmit={handleSubmit} className="registration-form">
        {isFieldVisible('name') && (
          <div className="form-group">
            <label htmlFor="name">{fieldLabels.name}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={getFieldClass('name')}
              disabled={disabled || isSubmitting}
              data-testid="name-input"
            />
            <div className="error" data-testid="name-error">
              {getErrorMessage('name')}
            </div>
          </div>
        )}
        
        {isFieldVisible('email') && (
          <div className="form-group">
            <label htmlFor="email">{fieldLabels.email}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={getFieldClass('email')}
              disabled={disabled || isSubmitting}
              data-testid="email-input"
            />
            <div className="error" data-testid="email-error">
              {getErrorMessage('email')}
            </div>
          </div>
        )}
        
        {isFieldVisible('password') && (
          <div className="form-group">
            <label htmlFor="password">{fieldLabels.password}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={getFieldClass('password')}
              disabled={disabled || isSubmitting}
              data-testid="password-input"
            />
            <div className="error" data-testid="password-error">
              {getErrorMessage('password')}
            </div>
          </div>
        )}
        
        {isFieldVisible('confirmPassword') && (
          <div className="form-group">
            <label htmlFor="confirmPassword">{fieldLabels.confirmPassword}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={getFieldClass('confirmPassword')}
              disabled={disabled || isSubmitting}
              data-testid="confirmPassword-input"
            />
            <div className="error" data-testid="confirmPassword-error">
              {getErrorMessage('confirmPassword')}
            </div>
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={disabled || isSubmitting}
          data-testid="submit-button"
        >
          {isSubmitting ? '처리 중...' : submitButtonText}
        </button>
      </form>
      
      {showSuccessMessage && successMessage && (
        <div className="success" data-testid="success-message">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default RegistrationFormWithProps;
