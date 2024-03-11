import { Room } from './room.model';

describe('Room', () => {
  it('should create an instance', () => {
    expect(new Room('Bedroom', [])).toBeTruthy();
  });
});
