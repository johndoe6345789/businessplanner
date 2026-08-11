import React from 'react';
import { render, screen, fireEvent } from
  '@testing-library/react';
import { NavSection } from '../NavSection';

jest.mock('@shared/components/ui/DrawerNavItem',
  () => ({
    DrawerNavItem: ({
      label, href,
    }: { label: string; href: string }) => (
      <a href={href}>{label}</a>
    ),
  }),
);

const LINKS = [
  { label: 'Planner', href: '/planner',
    section: 'plan' },
  { label: 'Dashboard', href: '/dashboard',
    section: 'plan' },
];

describe('NavSection', () => {
  it('renders section header', () => {
    render(
      <NavSection
        sectionKey="plan" label="Planning"
        links={LINKS} open={true}
        onToggle={jest.fn()}
      />,
    );
    expect(screen.getByText('Planning'))
      .toBeInTheDocument();
  });

  it('shows links when open', () => {
    render(
      <NavSection
        sectionKey="plan" label="Planning"
        links={LINKS} open={true}
        onToggle={jest.fn()}
      />,
    );
    expect(screen.getByText('Planner'))
      .toBeInTheDocument();
  });

  it('calls onToggle when header clicked', () => {
    const onToggle = jest.fn();
    render(
      <NavSection
        sectionKey="plan" label="Planning"
        links={LINKS} open={false}
        onToggle={onToggle}
      />,
    );
    fireEvent.click(screen.getByText('Planning'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('has correct data-testid', () => {
    render(
      <NavSection
        sectionKey="plan" label="Planning"
        links={LINKS} open={true}
        onToggle={jest.fn()}
      />,
    );
    expect(
      screen.getByTestId('nav-section-plan'),
    ).toBeInTheDocument();
  });
});
