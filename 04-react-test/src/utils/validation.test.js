import { describe, it, expect } from 'vitest';
import { validators, validateForm } from './validation.js';

describe('validators', () => {
  describe('validateName', () => {
    it('빈 이름에 대해 유효하지 않음을 반환한다', () => {
      const result = validators.validateName('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('이름을 입력해주세요.');
    });

    it('2글자 미만 이름에 대해 유효하지 않음을 반환한다', () => {
      const result = validators.validateName('a');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('이름은 2글자 이상이어야 합니다.');
    });

    it('50글자 초과 이름에 대해 유효하지 않음을 반환한다', () => {
      const longName = 'a'.repeat(51);
      const result = validators.validateName(longName);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('이름은 50글자 이하여야 합니다.');
    });

    it('잘못된 문자가 포함된 이름에 대해 유효하지 않음을 반환한다', () => {
      const result = validators.validateName('김철수123');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('이름은 한글, 영문만 입력 가능합니다.');
    });

    it('유효한 한글 이름에 대해 유효함을 반환한다', () => {
      const result = validators.validateName('김철수');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    it('유효한 영문 이름에 대해 유효함을 반환한다', () => {
      const result = validators.validateName('John Doe');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('빈 이메일에 대해 유효하지 않음을 반환한다', () => {
      const result = validators.validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('이메일을 입력해주세요.');
    });

    it('잘못된 이메일 형식에 대해 유효하지 않음을 반환한다', () => {
      const invalidEmails = [
        'test',
        'test@',
        '@example.com',
        'test@example',
        'test.example.com'
      ];

      invalidEmails.forEach(email => {
        const result = validators.validateEmail(email);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('올바른 이메일 형식이 아닙니다.');
      });
    });

    it('유효한 이메일에 대해 유효함을 반환한다', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.kr',
        'admin@test.org'
      ];

      validEmails.forEach(email => {
        const result = validators.validateEmail(email);
        expect(result.isValid).toBe(true);
        expect(result.message).toBe('');
      });
    });
  });

  describe('validatePassword', () => {
    it('빈 비밀번호에 대해 유효하지 않음을 반환한다', () => {
      const result = validators.validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('비밀번호를 입력해주세요.');
    });

    it('8글자 미만 비밀번호에 대해 유효하지 않음을 반환한다', () => {
      const result = validators.validatePassword('Pass1!');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('비밀번호는 8글자 이상이어야 합니다.');
    });

    it('100글자 초과 비밀번호에 대해 유효하지 않음을 반환한다', () => {
      const longPassword = 'Password123!'.repeat(10);
      const result = validators.validatePassword(longPassword);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('비밀번호는 100글자 이하여야 합니다.');
    });

    it('조건을 만족하지 않는 비밀번호에 대해 유효하지 않음을 반환한다', () => {
      const invalidPasswords = [
        'password', // 대문자, 숫자, 특수문자 없음
        'PASSWORD', // 소문자, 숫자, 특수문자 없음
        'Password', // 숫자, 특수문자 없음
        'Password123', // 특수문자 없음
        'Password!', // 숫자 없음
      ];

      invalidPasswords.forEach(password => {
        const result = validators.validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다.');
      });
    });

    it('유효한 비밀번호에 대해 유효함을 반환한다', () => {
      const validPasswords = [
        'Password123!',
        'MySecure@123',
        'Test#Pass1'
      ];

      validPasswords.forEach(password => {
        const result = validators.validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.message).toBe('');
      });
    });
  });

  describe('validatePasswordConfirm', () => {
    it('빈 비밀번호 확인에 대해 유효하지 않음을 반환한다', () => {
      const result = validators.validatePasswordConfirm('Password123!', '');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('비밀번호 확인을 입력해주세요.');
    });

    it('비밀번호와 일치하지 않을 때 유효하지 않음을 반환한다', () => {
      const result = validators.validatePasswordConfirm('Password123!', 'DifferentPassword123!');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('비밀번호가 일치하지 않습니다.');
    });

    it('비밀번호와 일치할 때 유효함을 반환한다', () => {
      const result = validators.validatePasswordConfirm('Password123!', 'Password123!');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });
  });
});

describe('validateForm', () => {
  it('모든 필드가 유효할 때 유효함을 반환한다', () => {
    const formData = {
      name: '김철수',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };

    const result = validateForm(formData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('유효하지 않은 필드가 있을 때 에러를 반환한다', () => {
    const formData = {
      name: 'a', // 너무 짧음
      email: 'invalid-email', // 잘못된 형식
      password: 'short', // 너무 짧음
      confirmPassword: 'different' // 일치하지 않음
    };

    const result = validateForm(formData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('name');
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('password');
    expect(result.errors).toHaveProperty('confirmPassword');
  });

  it('일부 필드만 유효하지 않을 때 해당 에러만 반환한다', () => {
    const formData = {
      name: '김철수', // 유효
      email: 'test@example.com', // 유효
      password: 'short', // 유효하지 않음
      confirmPassword: 'short' // 일치하지만 비밀번호가 유효하지 않음
    };

    const result = validateForm(formData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('password');
    expect(result.errors).not.toHaveProperty('name');
    expect(result.errors).not.toHaveProperty('email');
    expect(result.errors).not.toHaveProperty('confirmPassword');
  });
});
