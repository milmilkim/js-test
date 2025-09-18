/**
 * 밸리데이션 함수들
 */

export const validators = {
  /**
   * 이름 유효성 검사
   * @param {string} name 
   * @returns {object} { isValid: boolean, message: string }
   */
  validateName(name) {
    if (!name) {
      return { isValid: false, message: '이름을 입력해주세요.' };
    }
    if (name.length < 2) {
      return { isValid: false, message: '이름은 2글자 이상이어야 합니다.' };
    }
    if (name.length > 50) {
      return { isValid: false, message: '이름은 50글자 이하여야 합니다.' };
    }
    const nameRegex = /^[가-힣a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      return { isValid: false, message: '이름은 한글, 영문만 입력 가능합니다.' };
    }
    return { isValid: true, message: '' };
  },

  /**
   * 이메일 유효성 검사
   * @param {string} email 
   * @returns {object} { isValid: boolean, message: string }
   */
  validateEmail(email) {
    if (!email) {
      return { isValid: false, message: '이메일을 입력해주세요.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: '올바른 이메일 형식이 아닙니다.' };
    }
    return { isValid: true, message: '' };
  },

  /**
   * 비밀번호 유효성 검사
   * @param {string} password 
   * @returns {object} { isValid: boolean, message: string }
   */
  validatePassword(password) {
    if (!password) {
      return { isValid: false, message: '비밀번호를 입력해주세요.' };
    }
    if (password.length < 8) {
      return { isValid: false, message: '비밀번호는 8글자 이상이어야 합니다.' };
    }
    if (password.length > 100) {
      return { isValid: false, message: '비밀번호는 100글자 이하여야 합니다.' };
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/;
    if (!passwordRegex.test(password)) {
      return { isValid: false, message: '비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다.' };
    }
    return { isValid: true, message: '' };
  },

  /**
   * 비밀번호 확인 검사
   * @param {string} password 
   * @param {string} confirmPassword 
   * @returns {object} { isValid: boolean, message: string }
   */
  validatePasswordConfirm(password, confirmPassword) {
    if (!confirmPassword) {
      return { isValid: false, message: '비밀번호 확인을 입력해주세요.' };
    }
    if (password !== confirmPassword) {
      return { isValid: false, message: '비밀번호가 일치하지 않습니다.' };
    }
    return { isValid: true, message: '' };
  }
};

/**
 * 폼 전체 유효성 검사
 * @param {object} formData 
 * @returns {object} { isValid: boolean, errors: object }
 */
export function validateForm(formData) {
  const errors = {};
  let isValid = true;

  const nameResult = validators.validateName(formData.name);
  if (!nameResult.isValid) {
    errors.name = nameResult.message;
    isValid = false;
  }

  const emailResult = validators.validateEmail(formData.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.message;
    isValid = false;
  }

  const passwordResult = validators.validatePassword(formData.password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.message;
    isValid = false;
  }

  const confirmPasswordResult = validators.validatePasswordConfirm(
    formData.password, 
    formData.confirmPassword
  );
  if (!confirmPasswordResult.isValid) {
    errors.confirmPassword = confirmPasswordResult.message;
    isValid = false;
  }

  return { isValid, errors };
}

