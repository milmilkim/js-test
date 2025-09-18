import { validators, validateForm } from './validation.js';

/**
 * 폼 관리 클래스
 */
class FormManager {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.submitBtn = document.getElementById('submitBtn');
    this.successMessage = document.getElementById('successMessage');
    this.init();
  }

  init() {
    this.attachEventListeners();
  }

  attachEventListeners() {
    if (!this.form) {
      return;
    }
    
    // 실시간 밸리데이션
    this.form.addEventListener('input', (e) => {
      this.validateField(e.target);
    });

    // 폼 제출
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  /**
   * 개별 필드 밸리데이션
   * @param {HTMLElement} field 
   */
  validateField(field) {
    if (!field || field.value === undefined) {
      return;
    }
    
    const fieldName = field.name || field.id;
    const value = field.value.trim();
    const errorElement = document.getElementById(`${fieldName}Error`);
    
    let result;
    
    switch (fieldName) {
      case 'name':
        result = validators.validateName(value);
        break;
      case 'email':
        result = validators.validateEmail(value);
        break;
      case 'password':
        result = validators.validatePassword(value);
        // 비밀번호가 변경되면 비밀번호 확인도 다시 검사
        this.validatePasswordConfirm();
        break;
      case 'confirmPassword':
        const password = document.getElementById('password').value.trim();
        result = validators.validatePasswordConfirm(password, value);
        break;
      default:
        return;
    }

    this.updateFieldUI(field, errorElement, result);
  }

  /**
   * 비밀번호 확인 재검사
   */
  validatePasswordConfirm() {
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    
    if (confirmPasswordField.value) {
      const result = validators.validatePasswordConfirm(
        passwordField.value.trim(), 
        confirmPasswordField.value.trim()
      );
      const errorElement = document.getElementById('confirmPasswordError');
      this.updateFieldUI(confirmPasswordField, errorElement, result);
    }
  }

  /**
   * 필드 UI 업데이트
   * @param {HTMLElement} field 
   * @param {HTMLElement} errorElement 
   * @param {object} result 
   */
  updateFieldUI(field, errorElement, result) {
    if (result.isValid) {
      field.classList.remove('invalid');
      field.classList.add('valid');
      errorElement.textContent = '';
    } else {
      field.classList.remove('valid');
      field.classList.add('invalid');
      errorElement.textContent = result.message;
    }
  }

  /**
   * 폼 제출 처리
   */
  handleSubmit() {
    const formData = this.getFormData();
    const validation = validateForm(formData);

    this.clearAllErrors();

    if (validation.isValid) {
      this.handleSuccessfulSubmit(formData);
    } else {
      this.handleValidationErrors(validation.errors);
    }
  }

  /**
   * 폼 데이터 수집
   * @returns {object}
   */
  getFormData() {
    return {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value.trim(),
      confirmPassword: document.getElementById('confirmPassword').value.trim()
    };
  }

  /**
   * 모든 에러 메시지 클리어
   */
  clearAllErrors() {
    const errorElements = this.form.querySelectorAll('.error');
    errorElements.forEach(element => {
      element.textContent = '';
    });
    
    const inputs = this.form.querySelectorAll('input');
    inputs.forEach(input => {
      input.classList.remove('invalid');
    });
  }

  /**
   * 밸리데이션 에러 표시
   * @param {object} errors 
   */
  handleValidationErrors(errors) {
    Object.keys(errors).forEach(fieldName => {
      const errorElement = document.getElementById(`${fieldName}Error`);
      const field = document.getElementById(fieldName);
      
      if (errorElement && field) {
        errorElement.textContent = errors[fieldName];
        field.classList.add('invalid');
      }
    });
    
    this.successMessage.textContent = '';
  }

  /**
   * 성공적인 제출 처리
   * @param {object} formData 
   */
  handleSuccessfulSubmit(formData) {
    console.log('회원가입 성공:', formData);
    
    // 성공 메시지 표시
    this.successMessage.textContent = `${formData.name}님, 회원가입이 완료되었습니다!`;
    
    // 폼 리셋
    this.form.reset();
    
    // 모든 스타일 클래스 제거
    const inputs = this.form.querySelectorAll('input');
    inputs.forEach(input => {
      input.classList.remove('valid', 'invalid');
    });
  }
}

// DOM이 로드되면 폼 매니저 초기화
document.addEventListener('DOMContentLoaded', () => {
  window.formManager = new FormManager('registrationForm');
});

// 테스트를 위해 export
export { FormManager };

