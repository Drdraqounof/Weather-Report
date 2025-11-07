import { render, screen } from '@testing-library/react';
import App from './App';

test('renders weather overview heading', () => {
  render(<App />);
  const heading = screen.getByText(/7-Day Forecast/i);
  expect(heading).toBeInTheDocument();
});
