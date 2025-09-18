import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import RegistrationForm from './RegistrationForm';

describe('RegistrationForm', () => {
  beforeEach(() => {
    render(<RegistrationForm />);
  });

  describe('폼 렌더링', () => {
    it('폼 제목이 표시된다', () => {
      expect(screen.getByRole('heading', { name: '간단한 회원가입 폼' })).toBeInTheDocument();
    });

    it('모든 입력 필드가 표시된다', () => {
      expect(screen.getByLabelText('이름:')).toBeInTheDocument();
      expect(screen.getByLabelText('이메일:')).toBeInTheDocument();
      expect(screen.getByLabelText('비밀번호:')).toBeInTheDocument();
      expect(screen.getByLabelText('비밀번호 확인:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '가입하기' })).toBeInTheDocument();
    });
  });

  describe('이름 밸리데이션', () => {
    it('빈 이름에 대해 에러 메시지를 표시한다', async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText('이름:');
      
      await user.type(nameInput, 'a');
      await user.clear(nameInput);
      
      await waitFor(() => {
        expect(screen.getByTestId('name-error')).toHaveTextContent('이름을 입력해주세요.');
      });
    });

    it('2글자 미만 이름에 대해 에러 메시지를 표시한다', async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText('이름:');
      
      await user.type(nameInput, 'a');
      
      await waitFor(() => {
        expect(screen.getByTestId('name-error')).toHaveTextContent('이름은 2글자 이상이어야 합니다.');
      });
    });

    it('올바른 이름 형식이 아닐 때 에러 메시지를 표시한다', async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText('이름:');
      
      await user.type(nameInput, '123');
      
      await waitFor(() => {
        expect(screen.getByTestId('name-error')).toHaveTextContent('이름은 한글, 영문만 입력 가능합니다.');
      });
    });

    it('유효한 이름일 때 에러 메시지가 없다', async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText('이름:');
      
      await user.type(nameInput, '김철수');
      
      await waitFor(() => {
        expect(screen.getByTestId('name-error')).toHaveTextContent('');
      });
    });
  });

  describe('이메일 밸리데이션', () => {
    it('빈 이메일에 대해 에러 메시지를 표시한다', async () => {
      const user = userEvent.setup();
      const emailInput = screen.getByLabelText('이메일:');
      
      await user.type(emailInput, 'a');
      await user.clear(emailInput);
      
      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toHaveTextContent('이메일을 입력해주세요.');
      });
    });

    it('잘못된 이메일 형식에 대해 에러 메시지를 표시한다', async () => {
      const user = userEvent.setup();
      const emailInput = screen.getByLabelText('이메일:');
      
      await user.type(emailInput, 'invalid-email');
      
      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toHaveTextContent('올바른 이메일 형식이 아닙니다.');
      });
    });

    it('유효한 이메일일 때 에러 메시지가 없다', async () => {
      const user = userEvent.setup();
      const emailInput = screen.getByLabelText('이메일:');
      
      await user.type(emailInput, 'test@example.com');
      
      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toHaveTextContent('');
      });
    });
  });

  describe('비밀번호 밸리데이션', () => {
    it('빈 비밀번호에 대해 에러 메시지를 표시한다', async () => {
      const user = userEvent.setup();
      const passwordInput = screen.getByLabelText('비밀번호:');
      
      await user.type(passwordInput, 'a');
      await user.clear(passwordInput);
      
      await waitFor(() => {
        expect(screen.getByTestId('password-error')).toHaveTextContent('비밀번호를 입력해주세요.');
      });
    });

    it('8글자 미만 비밀번호에 대해 에러 메시지를 표시한다', async () => {
      const user = userEvent.setup();
      const passwordInput = screen.getByLabelText('비밀번호:');
      
      await user.type(passwordInput, 'Pass1!');
      
      await waitFor(() => {
        expect(screen.getByTestId('password-error')).toHaveTextContent('비밀번호는 8글자 이상이어야 합니다.');
      });
    });

    it('조건을 만족하지 않는 비밀번호에 대해 에러 메시지를 표시한다', async () => {
      const user = userEvent.setup();
      const passwordInput = screen.getByLabelText('비밀번호:');
      
      await user.type(passwordInput, 'password');
      
      await waitFor(() => {
        expect(screen.getByTestId('password-error')).toHaveTextContent('비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다.');
      });
    });

    it('유효한 비밀번호일 때 에러 메시지가 없다', async () => {
      const user = userEvent.setup();
      const passwordInput = screen.getByLabelText('비밀번호:');
      
      await user.type(passwordInput, 'Password123!');
      
      await waitFor(() => {
        expect(screen.getByTestId('password-error')).toHaveTextContent('');
      });
    });
  });

  describe('비밀번호 확인 밸리데이션', () => {
    it('빈 비밀번호 확인에 대해 에러 메시지를 표시한다', async () => {
      const user = userEvent.setup();
      const confirmPasswordInput = screen.getByLabelText('비밀번호 확인:');
      
      await user.type(confirmPasswordInput, 'a');
      await user.clear(confirmPasswordInput);
      
      await waitFor(() => {
        expect(screen.getByTestId('confirmPassword-error')).toHaveTextContent('비밀번호 확인을 입력해주세요.');
      });
    });

    it('비밀번호와 일치하지 않을 때 에러 메시지를 표시한다', async () => {
      const user = userEvent.setup();
      const passwordInput = screen.getByLabelText('비밀번호:');
      const confirmPasswordInput = screen.getByLabelText('비밀번호 확인:');
      
      await user.type(passwordInput, 'Password123!');
      await user.type(confirmPasswordInput, 'DifferentPassword123!');
      
      await waitFor(() => {
        expect(screen.getByTestId('confirmPassword-error')).toHaveTextContent('비밀번호가 일치하지 않습니다.');
      });
    });

    it('비밀번호와 일치할 때 에러 메시지가 없다', async () => {
      const user = userEvent.setup();
      const passwordInput = screen.getByLabelText('비밀번호:');
      const confirmPasswordInput = screen.getByLabelText('비밀번호 확인:');
      
      await user.type(passwordInput, 'Password123!');
      await user.type(confirmPasswordInput, 'Password123!');
      
      await waitFor(() => {
        expect(screen.getByTestId('confirmPassword-error')).toHaveTextContent('');
      });
    });
  });

  describe('폼 제출', () => {
    it('모든 필드가 유효할 때 성공 메시지를 표시한다', async () => {
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText('이름:'), '김철수');
      await user.type(screen.getByLabelText('이메일:'), 'test@example.com');
      await user.type(screen.getByLabelText('비밀번호:'), 'Password123!');
      await user.type(screen.getByLabelText('비밀번호 확인:'), 'Password123!');
      
      await user.click(screen.getByRole('button', { name: '가입하기' }));
      
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toHaveTextContent('김철수님, 회원가입이 완료되었습니다!');
      });
    });

    it('성공 후 폼이 리셋된다', async () => {
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText('이름:'), '김철수');
      await user.type(screen.getByLabelText('이메일:'), 'test@example.com');
      await user.type(screen.getByLabelText('비밀번호:'), 'Password123!');
      await user.type(screen.getByLabelText('비밀번호 확인:'), 'Password123!');
      
      await user.click(screen.getByRole('button', { name: '가입하기' }));
      
      await waitFor(() => {
        expect(screen.getByLabelText('이름:')).toHaveValue('');
        expect(screen.getByLabelText('이메일:')).toHaveValue('');
        expect(screen.getByLabelText('비밀번호:')).toHaveValue('');
        expect(screen.getByLabelText('비밀번호 확인:')).toHaveValue('');
      });
    });

    it('유효하지 않은 필드가 있을 때 에러 메시지를 표시한다', async () => {
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText('이름:'), 'a'); // 너무 짧음
      await user.type(screen.getByLabelText('이메일:'), 'invalid'); // 잘못된 형식
      
      await user.click(screen.getByRole('button', { name: '가입하기' }));
      
      await waitFor(() => {
        expect(screen.getByTestId('name-error')).toHaveTextContent('이름은 2글자 이상이어야 합니다.');
        expect(screen.getByTestId('email-error')).toHaveTextContent('올바른 이메일 형식이 아닙니다.');
      });
    });
  });

  describe('실시간 밸리데이션 상태', () => {
    it('유효한 입력 시 valid 클래스가 적용된다', async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText('이름:');
      
      await user.type(nameInput, '김철수');
      
      await waitFor(() => {
        expect(nameInput).toHaveClass('valid');
      });
    });

    it('유효하지 않은 입력 시 invalid 클래스가 적용된다', async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText('이름:');
      
      await user.type(nameInput, 'a');
      
      await waitFor(() => {
        expect(nameInput).toHaveClass('invalid');
      });
    });
  });
});
