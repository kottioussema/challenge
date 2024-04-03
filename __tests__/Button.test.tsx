import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Button} from '../src/components/Button';

describe('Button', () => {
  it('renders correctly', () => {
    const {getByTestId} = render(
      <Button onPress={() => {}} title="Test Button" />,
    );
    expect(getByTestId('MyButton')).toBeDefined();
  });

  it('calls onPress callback when pressed', () => {
    const onPressMock = jest.fn();
    const {getByTestId} = render(<Button onPress={onPressMock} title="" />);

    fireEvent.press(getByTestId('MyButton'));
    expect(onPressMock).toHaveBeenCalled();
  });

  it('displays the correct text inside the button', () => {
    const {getByTestId} = render(<Button onPress={() => {}} title="" />);
    expect(getByTestId('MyButton:Text')).toBeDefined();
  });
});
