import { SignMiddleware } from './sign.middleware';

describe('SignMiddleware', () => {
  it('should be defined', () => {
    expect(new SignMiddleware()).toBeDefined();
  });
});
