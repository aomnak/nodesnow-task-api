import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  const originalSecret = process.env.JWT_SECRET;

  afterAll(() => {
    // Restore original JWT_SECRET
    process.env.JWT_SECRET = originalSecret;
  });

  describe('constructor', () => {
    it('should throw an error if JWT_SECRET is missing', () => {
      delete process.env.JWT_SECRET;

      expect(() => new JwtStrategy()).toThrowError('Missing JWT_SECRET environment variable');
    });

    it('should construct strategy if JWT_SECRET is present', () => {
      process.env.JWT_SECRET = 'test-secret';
      expect(() => new JwtStrategy()).not.toThrow();
    });
  });

  describe('validate', () => {
    it('should return userId and email from payload when valid', async () => {
      process.env.JWT_SECRET = 'test-secret';
      const strategy = new JwtStrategy();
      const payload = { sub: '123', email: 'test@example.com' };
      const result = await strategy.validate(payload);

      expect(result).toEqual({ userId: '123', email: 'test@example.com' });
    });

    it('should throw UnauthorizedException if sub is missing', async () => {
      process.env.JWT_SECRET = 'test-secret';
      const strategy = new JwtStrategy();
      const invalidPayload = { email: 'test@example.com' };

      await expect(strategy.validate(invalidPayload as any)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if email is missing', async () => {
      process.env.JWT_SECRET = 'test-secret';
      const strategy = new JwtStrategy();
      const invalidPayload = { sub: '123' };

      await expect(strategy.validate(invalidPayload as any)).rejects.toThrow(UnauthorizedException);
    });
  });
});
