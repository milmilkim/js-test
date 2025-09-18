import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import RegistrationFormWithProps from './RegistrationFormWithProps';

describe('RegistrationFormWithProps - Props에 따른 동작 테스트', () => {
  describe('기본 Props', () => {
    it('기본 제목이 표시된다', () => {
      render(<RegistrationFormWithProps />);
      expect(screen.getByRole('heading', { name: '간단한 회원가입 폼' })).toBeInTheDocument();
    });

    it('기본 제출 버튼 텍스트가 표시된다', () => {
      render(<RegistrationFormWithProps />);
      expect(screen.getByRole('button', { name: '가입하기' })).toBeInTheDocument();
    });

    it('모든 필드가 기본적으로 표시된다', () => {
      render(<RegistrationFormWithProps />);
      expect(screen.getByTestId('name-input')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('confirmPassword-input')).toBeInTheDocument();
    });
  });

  describe('커스텀 Props', () => {
    it('커스텀 제목이 표시된다', () => {
      render(<RegistrationFormWithProps title="회원 등록 폼" />);
      expect(screen.getByRole('heading', { name: '회원 등록 폼' })).toBeInTheDocument();
    });

    it('커스텀 제출 버튼 텍스트가 표시된다', () => {
      render(<RegistrationFormWithProps submitButtonText="등록하기" />);
      expect(screen.getByRole('button', { name: '등록하기' })).toBeInTheDocument();
    });

    it('커스텀 CSS 클래스가 적용된다', () => {
      render(<RegistrationFormWithProps className="custom-form" />);
      expect(document.querySelector('.registration-container')).toHaveClass('custom-form');
    });

    it('커스텀 필드 라벨이 표시된다', () => {
      const customLabels = {
        name: '성명:',
        email: '이메일 주소:',
        password: '암호:',
        confirmPassword: '암호 확인:'
      };
      
      render(<RegistrationFormWithProps fieldLabels={customLabels} />);
      
      expect(screen.getByText('성명:')).toBeInTheDocument();
      expect(screen.getByText('이메일 주소:')).toBeInTheDocument();
      expect(screen.getByText('암호:')).toBeInTheDocument();
      expect(screen.getByText('암호 확인:')).toBeInTheDocument();
    });
  });

  describe('초기값 Props', () => {
    it('초기값이 입력 필드에 설정된다', () => {
      const initialValues = {
        name: '김철수',
        email: 'kim@example.com',
        password: '',
        confirmPassword: ''
      };

      render(<RegistrationFormWithProps initialValues={initialValues} />);

      expect(screen.getByTestId('name-input')).toHaveValue('김철수');
      expect(screen.getByTestId('email-input')).toHaveValue('kim@example.com');
    });
  });

  describe('필드 숨김 Props', () => {
    it('hiddenFields에 지정된 필드가 숨겨진다', () => {
      render(<RegistrationFormWithProps hiddenFields={['confirmPassword']} />);

      expect(screen.getByTestId('name-input')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.queryByTestId('confirmPassword-input')).not.toBeInTheDocument();
    });

    it('여러 필드를 숨길 수 있다', () => {
      render(<RegistrationFormWithProps hiddenFields={['password', 'confirmPassword']} />);

      expect(screen.getByTestId('name-input')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.queryByTestId('password-input')).not.toBeInTheDocument();
      expect(screen.queryByTestId('confirmPassword-input')).not.toBeInTheDocument();
    });
  });

  describe('비활성화 Props', () => {
    it('disabled=true일 때 모든 입력 필드와 버튼이 비활성화된다', () => {
      render(<RegistrationFormWithProps disabled={true} />);

      expect(screen.getByTestId('name-input')).toBeDisabled();
      expect(screen.getByTestId('email-input')).toBeDisabled();
      expect(screen.getByTestId('password-input')).toBeDisabled();
      expect(screen.getByTestId('confirmPassword-input')).toBeDisabled();
      expect(screen.getByTestId('submit-button')).toBeDisabled();
    });

    it('disabled=false일 때 모든 입력 필드와 버튼이 활성화된다', () => {
      render(<RegistrationFormWithProps disabled={false} />);

      expect(screen.getByTestId('name-input')).not.toBeDisabled();
      expect(screen.getByTestId('email-input')).not.toBeDisabled();
      expect(screen.getByTestId('password-input')).not.toBeDisabled();
      expect(screen.getByTestId('confirmPassword-input')).not.toBeDisabled();
      expect(screen.getByTestId('submit-button')).not.toBeDisabled();
    });
  });

  describe('실시간 밸리데이션 Props', () => {
    it('enableRealTimeValidation=true일 때 실시간 밸리데이션이 작동한다', async () => {
      const user = userEvent.setup();
      render(<RegistrationFormWithProps enableRealTimeValidation={true} />);

      const nameInput = screen.getByTestId('name-input');
      await user.type(nameInput, 'a');

      await waitFor(() => {
        expect(screen.getByTestId('name-error')).toHaveTextContent('이름은 2글자 이상이어야 합니다.');
      });
    });

    it('enableRealTimeValidation=false일 때 실시간 밸리데이션이 작동하지 않는다', async () => {
      const user = userEvent.setup();
      render(<RegistrationFormWithProps enableRealTimeValidation={false} />);

      const nameInput = screen.getByTestId('name-input');
      await user.type(nameInput, 'a');

      // 실시간 밸리데이션이 비활성화되어 있으므로 에러 메시지가 표시되지 않음
      expect(screen.getByTestId('name-error')).toHaveTextContent('');
    });
  });

  describe('콜백 Props', () => {
    it('onSuccess 콜백이 성공 시 호출된다', async () => {
      const onSuccess = vi.fn();
      const user = userEvent.setup();

      render(<RegistrationFormWithProps onSuccess={onSuccess} />);

      // 유효한 데이터 입력
      await user.type(screen.getByTestId('name-input'), '김철수');
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'Password123!');
      await user.type(screen.getByTestId('confirmPassword-input'), 'Password123!');

      await user.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith({
          name: '김철수',
          email: 'test@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!'
        });
      });
    });

    it('onError 콜백이 에러 시 호출된다', async () => {
      const onSuccess = vi.fn().mockRejectedValue(new Error('서버 에러'));
      const onError = vi.fn();
      const user = userEvent.setup();

      render(
        <RegistrationFormWithProps 
          onSuccess={onSuccess} 
          onError={onError} 
        />
      );

      // 유효한 데이터 입력
      await user.type(screen.getByTestId('name-input'), '김철수');
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'Password123!');
      await user.type(screen.getByTestId('confirmPassword-input'), 'Password123!');

      await user.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });

  describe('제출 중 상태', () => {
    it('제출 중일 때 버튼 텍스트가 변경되고 비활성화된다', async () => {
      const onSuccess = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      const user = userEvent.setup();

      render(<RegistrationFormWithProps onSuccess={onSuccess} />);

      // 유효한 데이터 입력
      await user.type(screen.getByTestId('name-input'), '김철수');
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'Password123!');
      await user.type(screen.getByTestId('confirmPassword-input'), 'Password123!');

      // 제출 버튼 클릭
      const submitPromise = user.click(screen.getByTestId('submit-button'));

      // 제출 중 상태 확인
      await waitFor(() => {
        expect(screen.getByTestId('submit-button')).toHaveTextContent('처리 중...');
        expect(screen.getByTestId('submit-button')).toBeDisabled();
      });

      await submitPromise;
    });

    it('제출 중일 때 모든 입력 필드가 비활성화된다', async () => {
      const onSuccess = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      const user = userEvent.setup();

      render(<RegistrationFormWithProps onSuccess={onSuccess} />);

      // 유효한 데이터 입력
      await user.type(screen.getByTestId('name-input'), '김철수');
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'Password123!');
      await user.type(screen.getByTestId('confirmPassword-input'), 'Password123!');

      // 제출 버튼 클릭
      const submitPromise = user.click(screen.getByTestId('submit-button'));

      // 제출 중 입력 필드 비활성화 확인
      await waitFor(() => {
        expect(screen.getByTestId('name-input')).toBeDisabled();
        expect(screen.getByTestId('email-input')).toBeDisabled();
        expect(screen.getByTestId('password-input')).toBeDisabled();
        expect(screen.getByTestId('confirmPassword-input')).toBeDisabled();
      });

      await submitPromise;
    });
  });

  describe('성공 메시지 Props', () => {
    it('successMessage가 제공되면 성공 메시지를 표시한다', () => {
      render(
        <RegistrationFormWithProps 
          successMessage="회원가입이 완료되었습니다!" 
        />
      );

      expect(screen.getByTestId('success-message')).toHaveTextContent('회원가입이 완료되었습니다!');
    });

    it('showSuccessMessage=false일 때 성공 메시지를 숨긴다', () => {
      render(
        <RegistrationFormWithProps 
          successMessage="회원가입이 완료되었습니다!" 
          showSuccessMessage={false}
        />
      );

      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
    });
  });

  describe('복합 Props 시나리오', () => {
    it('여러 Props를 조합하여 사용할 수 있다', () => {
      const props = {
        title: '커스텀 회원가입',
        submitButtonText: '가입완료',
        hiddenFields: ['confirmPassword'],
        disabled: false,
        enableRealTimeValidation: false,
        className: 'custom-registration',
        fieldLabels: {
          name: '이름:',
          email: '이메일:',
          password: '비밀번호:'
        }
      };

      render(<RegistrationFormWithProps {...props} />);

      expect(screen.getByRole('heading', { name: '커스텀 회원가입' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '가입완료' })).toBeInTheDocument();
      expect(screen.queryByTestId('confirmPassword-input')).not.toBeInTheDocument();
      expect(document.querySelector('.registration-container')).toHaveClass('custom-registration');
    });
  });
});
