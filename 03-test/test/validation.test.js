import { describe, it, expect } from 'vitest';
import { validators, validateForm } from '../src/validation.js';

describe('validators', () => {
  describe('validateName', () => {
    it('빈 이름일 때 유효하지 않아야 함', () => {
      const result = validators.validateName('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('이름을 입력해주세요.');
    });

    it('2글자 미만일 때 유효하지 않아야 함', () => {
      const result = validators.validateName('a');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('이름은 2글자 이상이어야 합니다.');
    });

    it('50글자 초과일 때 유효하지 않아야 함', () => {
      const longName = 'a'.repeat(51);
      const result = validators.validateName(longName);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('이름은 50글자 이하여야 합니다.');
    });

    it('특수문자나 숫자가 포함되면 유효하지 않아야 함', () => {
      const result = validators.validateName('홍길동123');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('이름은 한글, 영문만 입력 가능합니다.');
    });

    it('유효한 한글 이름은 통과해야 함', () => {
      const result = validators.validateName('홍길동');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    it('유효한 영문 이름은 통과해야 함', () => {
      const result = validators.validateName('John Doe');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('빈 이메일일 때 유효하지 않아야 함', () => {
      const result = validators.validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('이메일을 입력해주세요.');
    });

    it('잘못된 이메일 형식은 유효하지 않아야 함', () => {
      const invalidEmails = [
        'test',
        'test@',
        '@test.com',
        'test@test',
        'test.test.com'
      ];

      invalidEmails.forEach(email => {
        const result = validators.validateEmail(email);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('올바른 이메일 형식이 아닙니다.');
      });
    });

    it('유효한 이메일은 통과해야 함', () => {
      const validEmails = [
        'test@test.com',
        'user@example.org',
        'hello.world@test.co.kr'
      ];

      validEmails.forEach(email => {
        const result = validators.validateEmail(email);
        expect(result.isValid).toBe(true);
        expect(result.message).toBe('');
      });
    });
  });

  describe('validatePassword', () => {
    it('빈 비밀번호일 때 유효하지 않아야 함', () => {
      const result = validators.validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('비밀번호를 입력해주세요.');
    });

    it('8글자 미만일 때 유효하지 않아야 함', () => {
      const result = validators.validatePassword('Test1!');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('비밀번호는 8글자 이상이어야 합니다.');
    });

    it('100글자 초과일 때 유효하지 않아야 함', () => {
      const longPassword = 'Test1!' + 'a'.repeat(95);
      const result = validators.validatePassword(longPassword);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('비밀번호는 100글자 이하여야 합니다.');
    });

    it('조건을 만족하지 않는 비밀번호는 유효하지 않아야 함', () => {
      const weakPasswords = [
        'password',      // 대문자, 숫자, 특수문자 없음
        'PASSWORD',      // 소문자, 숫자, 특수문자 없음
        'Password',      // 숫자, 특수문자 없음
        'Password1',     // 특수문자 없음
        'Password!'      // 숫자 없음
      ];

      weakPasswords.forEach(password => {
        const result = validators.validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다.');
      });
    });

    it('유효한 비밀번호는 통과해야 함', () => {
      const validPasswords = [
        'Password1!',
        'Test123@',
        'MySecret99#'
      ];

      validPasswords.forEach(password => {
        const result = validators.validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.message).toBe('');
      });
    });
  });

  describe('validatePasswordConfirm', () => {
    it('빈 비밀번호 확인일 때 유효하지 않아야 함', () => {
      const result = validators.validatePasswordConfirm('Password1!', '');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('비밀번호 확인을 입력해주세요.');
    });

    it('비밀번호가 일치하지 않을 때 유효하지 않아야 함', () => {
      const result = validators.validatePasswordConfirm('Password1!', 'Password2!');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('비밀번호가 일치하지 않습니다.');
    });

    it('비밀번호가 일치할 때 유효해야 함', () => {
      const result = validators.validatePasswordConfirm('Password1!', 'Password1!');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });
  });
});

describe('validateForm', () => {
  it('모든 필드가 유효하지 않을 때', () => {
    const formData = {
      name: '',
      email: 'invalid-email',
      password: 'weak',
      confirmPassword: 'different'
    };

    const result = validateForm(formData);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('name');
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('password');
    expect(result.errors).toHaveProperty('confirmPassword');
  });

  it('모든 필드가 유효할 때', () => {
    const formData = {
      name: '홍길동',
      email: 'hong@test.com',
      password: 'Password1!',
      confirmPassword: 'Password1!'
    };

    const result = validateForm(formData);
    
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('일부 필드만 유효하지 않을 때', () => {
    const formData = {
      name: '홍길동',
      email: 'hong@test.com',
      password: 'weak',
      confirmPassword: 'different'
    };

    const result = validateForm(formData);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).not.toHaveProperty('name');
    expect(result.errors).not.toHaveProperty('email');
    expect(result.errors).toHaveProperty('password');
    expect(result.errors).toHaveProperty('confirmPassword');
  });
});

