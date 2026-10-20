import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock(
  '@/components/molecules/WizardStepContent',
  () => ({
    WizardStepContent: ({
      onName,
    }: { onName: (v: string) => void }) => (
      <input
        data-testid="wizard-name-input"
        onChange={(e) => onName(e.target.value)}
      />
    ),
  }),
);

jest.mock(
  '@/components/molecules/WizardNavButtons',
  () => ({
    WizardNavButtons: ({
      valid,
    }: { valid: boolean }) => (
      <button
        data-testid="wizard-next-btn"
        disabled={!valid}
      >
        Next
      </button>
    ),
  }),
);

import { OnboardingWizard } from
  '../OnboardingWizard';

const renderWithStore = (ui: React.ReactElement) =>
  render(<Provider store={store}>{ui}</Provider>);

describe('OnboardingWizard', () => {
  it('renders step 1', () => {
    renderWithStore(<OnboardingWizard />);
    expect(
      screen.getByTestId('onboarding-wizard'),
    ).toBeInTheDocument();
  });

  it('Next button disabled when name empty', () => {
    renderWithStore(<OnboardingWizard />);
    expect(
      screen.getByTestId('wizard-next-btn'),
    ).toBeDisabled();
  });

  it('Next button enabled when name filled', async () => {
    renderWithStore(<OnboardingWizard />);
    await userEvent.type(
      screen.getByTestId('wizard-name-input'),
      'Acme',
    );
    expect(
      screen.getByTestId('wizard-next-btn'),
    ).toBeEnabled();
  });
});
