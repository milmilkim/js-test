import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  getByLabelText,
  getByText,
  getByRole,
  queryByText,
  waitFor,
} from '@testing-library/dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { FormManager } from '../src/main.js';

describe('FormManager 통합 테스트', () => {
  let formManager;
  let user;
  let container;

  function getFormDOM() {
    const div = document.createElement('div');
    div.innerHTML = `
      <h1>간단한 회원가입 폼</h1>
      
      <form id="registrationForm">
          <div class="form-group">
              <label for="name">이름:</label>
              <input type="text" id="name" name="name">
              <div id="nameError" class="error"></div>
          </div>
          
          <div class="form-group">
              <label for="email">이메일:</label>
              <input type="email" id="email" name="email">
              <div id="emailError" class="error"></div>
          </div>
          
          <div class="form-group">
              <label for="password">비밀번호:</label>
              <input type="password" id="password" name="password">
              <div id="passwordError" class="error"></div>
          </div>
          
          <div class="form-group">
              <label for="confirmPassword">비밀번호 확인:</label>
              <input type="password" id="confirmPassword" name="confirmPassword">
              <div id="confirmPasswordError" class="error"></div>
          </div>
          
          <button type="submit" id="submitBtn">가입하기</button>
      </form>
      
      <div id="successMessage" class="success"></div>
    `;
    return div;
  }

  beforeEach(() => {
    user = userEvent.setup();
    
    // DOM 생성
    container = getFormDOM();
    
    // document.body에 추가 (FormManager가 document.getElementById를 사용하므로)
    document.body.innerHTML = '';
    document.body.appendChild(container);
    
    formManager = new FormManager('registrationForm');
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('폼 초기화', () => {
    it('폼과 필수 요소들이 렌더링되고 초기화되어야 함', () => {
      // 폼 요소들이 렌더링되어 있는지 확인
      expect(getByLabelText(container, '이름:')).toBeInTheDocument();
      expect(getByLabelText(container, '이메일:')).toBeInTheDocument();
      expect(getByLabelText(container, '비밀번호:')).toBeInTheDocument();
      expect(getByLabelText(container, '비밀번호 확인:')).toBeInTheDocument();
      expect(getByRole(container, 'button', { name: '가입하기' })).toBeInTheDocument();

      // FormManager가 제대로 초기화되었는지 확인
      expect(formManager.form).toBeTruthy();
      expect(formManager.submitBtn).toBeTruthy();
      expect(formManager.successMessage).toBeTruthy();
    });
  });

  describe('실시간 밸리데이션', () => {
    it('사용자가 이름을 입력할 때 실시간으로 검증되어야 함', async () => {
      const nameInput = getByLabelText(container, '이름:');
      
      // 잘못된 입력
      await user.type(nameInput, 'a');
      expect(nameInput).toHaveClass('invalid');
      expect(getByText(container, '이름은 2글자 이상이어야 합니다.')).toBeInTheDocument();
      
      // 올바른 입력으로 수정
      await user.clear(nameInput);
      await user.type(nameInput, '홍길동');
      expect(nameInput).toHaveClass('valid');
      expect(queryByText(container, '이름은 2글자 이상이어야 합니다.')).not.toBeInTheDocument();
    });

    it('사용자가 이메일을 입력할 때 실시간으로 검증되어야 함', async () => {
      const emailInput = getByLabelText(container, '이메일:');
      
      // 잘못된 이메일 형식
      await user.type(emailInput, 'invalid-email');
      expect(emailInput).toHaveClass('invalid');
      expect(getByText(container, '올바른 이메일 형식이 아닙니다.')).toBeInTheDocument();
      
      // 올바른 이메일로 수정
      await user.clear(emailInput);
      await user.type(emailInput, 'test@example.com');
      expect(emailInput).toHaveClass('valid');
      expect(queryByText(container, '올바른 이메일 형식이 아닙니다.')).not.toBeInTheDocument();
    });

    it('사용자가 비밀번호를 입력할 때 실시간으로 검증되어야 함', async () => {
      const passwordInput = getByLabelText(container, '비밀번호:');
      
      // 약한 비밀번호
      await user.type(passwordInput, 'weak');
      expect(passwordInput).toHaveClass('invalid');
      expect(getByText(container, '비밀번호는 8글자 이상이어야 합니다.')).toBeInTheDocument();
      
      // 강한 비밀번호로 수정
      await user.clear(passwordInput);
      await user.type(passwordInput, 'StrongPass1!');
      expect(passwordInput).toHaveClass('valid');
      expect(queryByText(container, '비밀번호는 8글자 이상이어야 합니다.')).not.toBeInTheDocument();
    });

    it('비밀번호 확인 필드가 실시간으로 검증되어야 함', async () => {
      const passwordInput = getByLabelText(container, '비밀번호:');
      const confirmPasswordInput = getByLabelText(container, '비밀번호 확인:');
      
      // 먼저 비밀번호 입력
      await user.type(passwordInput, 'Password123!');
      
      // 다른 비밀번호 확인 입력
      await user.type(confirmPasswordInput, 'DifferentPass!');
      expect(confirmPasswordInput).toHaveClass('invalid');
      expect(getByText(container, '비밀번호가 일치하지 않습니다.')).toBeInTheDocument();
      
      // 같은 비밀번호로 수정
      await user.clear(confirmPasswordInput);
      await user.type(confirmPasswordInput, 'Password123!');
      expect(confirmPasswordInput).toHaveClass('valid');
      expect(queryByText(container, '비밀번호가 일치하지 않습니다.')).not.toBeInTheDocument();
    });
  });

  describe('폼 제출', () => {
    it('유효하지 않은 데이터로 제출하면 에러 메시지들이 표시되어야 함', async () => {
      const submitButton = getByRole(container, 'button', { name: '가입하기' });
      
      // 빈 폼 제출
      await user.click(submitButton);
      
      // 에러 메시지들이 나타날 때까지 기다림
      expect(getByText(container, '이름을 입력해주세요.')).toBeInTheDocument();      
      expect(getByText(container, '이메일을 입력해주세요.')).toBeInTheDocument();
      expect(getByText(container, '비밀번호를 입력해주세요.')).toBeInTheDocument();
      expect(getByText(container, '비밀번호 확인을 입력해주세요.')).toBeInTheDocument();
      
      // 성공 메시지는 표시되지 않아야 함
      expect(queryByText(container, /회원가입이 완료되었습니다/)).not.toBeInTheDocument();
    });

    it('유효한 데이터로 제출하면 성공 메시지가 표시되고 폼이 리셋되어야 함', async () => {
      const nameInput = getByLabelText(container, '이름:');
      const emailInput = getByLabelText(container, '이메일:');
      const passwordInput = getByLabelText(container, '비밀번호:');
      const confirmPasswordInput = getByLabelText(container, '비밀번호 확인:');
      const submitButton = getByRole(container, 'button', { name: '가입하기' });
      
      // 유효한 데이터 입력
      await user.type(nameInput, '김철수');
      await user.type(emailInput, 'kim@test.com');
      await user.type(passwordInput, 'SecurePass1!');
      await user.type(confirmPasswordInput, 'SecurePass1!');
      
      // 제출
      await user.click(submitButton);
      
      // 성공 메시지 확인
      expect(getByText(container, '김철수님, 회원가입이 완료되었습니다!')).toBeInTheDocument();
      
      // console.log 호출 확인
      expect(console.log).toHaveBeenCalledWith('회원가입 성공:', {
        name: '김철수',
        email: 'kim@test.com',
        password: 'SecurePass1!',
        confirmPassword: 'SecurePass1!'
      });
      
      // 폼이 리셋되었는지 확인
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
      expect(confirmPasswordInput).toHaveValue('');
      
      // 스타일 클래스가 제거되었는지 확인
      expect(nameInput).not.toHaveClass('valid');
      expect(nameInput).not.toHaveClass('invalid');
      expect(emailInput).not.toHaveClass('valid');
      expect(emailInput).not.toHaveClass('invalid');
    });
  });

  describe('사용자 시나리오', () => {
    it('완전한 회원가입 플로우를 시뮬레이션해야 함', async () => {
      // 사용자가 폼을 발견하고 입력을 시작
      expect(getByRole(container, 'heading', { name: '간단한 회원가입 폼' })).toBeInTheDocument();
      
      const nameInput = getByLabelText(container, '이름:');
      const emailInput = getByLabelText(container, '이메일:');
      const passwordInput = getByLabelText(container, '비밀번호:');
      const confirmPasswordInput = getByLabelText(container, '비밀번호 확인:');
      const submitButton = getByRole(container, 'button', { name: '가입하기' });
      
      // 1단계: 사용자가 순서대로 입력
      await user.type(nameInput, '이영희');
      expect(nameInput).toHaveClass('valid');
      
      await user.type(emailInput, 'younghee@example.com');
      expect(emailInput).toHaveClass('valid');
      
      await user.type(passwordInput, 'MySecretPass1!');
      expect(passwordInput).toHaveClass('valid');
      
      await user.type(confirmPasswordInput, 'MySecretPass1!');
      expect(confirmPasswordInput).toHaveClass('valid');
      
      // 2단계: 사용자가 제출
      await user.click(submitButton);
      
      // 3단계: 성공 확인
      expect(getByText(container, '이영희님, 회원가입이 완료되었습니다!')).toBeInTheDocument();
      
      // 4단계: 폼이 깨끗하게 리셋되어 다음 사용자를 위해 준비됨
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
      expect(confirmPasswordInput).toHaveValue('');
    });

    it('사용자가 실수를 하고 수정하는 시나리오를 시뮬레이션해야 함', async () => {
      const emailInput = getByLabelText(container, '이메일:');
      const passwordInput = getByLabelText(container, '비밀번호:');
      const confirmPasswordInput = getByLabelText(container, '비밀번호 확인:');
      
      // 사용자가 실수로 잘못 입력
      await user.type(emailInput, 'wrong-email');
      expect(getByText(container, '올바른 이메일 형식이 아닙니다.')).toBeInTheDocument();
      
      // 사용자가 다시 시도
      await user.clear(emailInput);
      await user.type(emailInput, 'correct@email.com');
      expect(queryByText(container, '올바른 이메일 형식이 아닙니다.')).not.toBeInTheDocument();
      
      // 비밀번호 불일치 시나리오
      await user.type(passwordInput, 'GoodPassword1!');
      await user.type(confirmPasswordInput, 'DifferentPassword1!');
      expect(getByText(container, '비밀번호가 일치하지 않습니다.')).toBeInTheDocument();
      
      // 사용자가 수정
      await user.clear(confirmPasswordInput);
      await user.type(confirmPasswordInput, 'GoodPassword1!');
      expect(queryByText(container, '비밀번호가 일치하지 않습니다.')).not.toBeInTheDocument();
    });
  });
});