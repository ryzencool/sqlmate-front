// @ts-expect-error TS(2307) FIXME: Cannot find module '@testing-library/react' or its... Remove this comment to see the full error message
import { render, screen } from '@testing-library/react';
import App from './App';

// @ts-expect-error TS(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
  expect(linkElement).toBeInTheDocument();
});
