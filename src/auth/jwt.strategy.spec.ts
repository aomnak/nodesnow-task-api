import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  const originalSecret = process.env.JWT_SECRET;

  afterAll(() => {
    // คืนค่า JWT_SECRET เดิม (ป้องกัน side effects ต่อการทดสอบอื่น)
    process.env.JWT_SECRET = originalSecret;
  });

  describe('constructor', () => {
    it('should throw an error if JWT_SECRET is missing', () => {
      delete process.env.JWT_SECRET; // ลบค่าออกเพื่อจำลองกรณีไม่มี JWT_SECRET

      expect(() => new JwtStrategy()).toThrowError('Missing JWT_SECRET environment variable');
    });

    it('should construct strategy if JWT_SECRET is present', () => {
      process.env.JWT_SECRET = 'test-secret';

      // เรียก constructor โดยไม่ error
      expect(() => new JwtStrategy()).not.toThrow();
    });
  });

  describe('validate', () => {
    it('should return userId and email from payload when JWT_SECRET is set', async () => {
      process.env.JWT_SECRET = 'test-secret';
      const strategy = new JwtStrategy();
      const payload = { sub: '123', email: 'test@example.com' };
      const result = await strategy.validate(payload);

      expect(result).toEqual({ userId: '123', email: 'test@example.com' });
    });

    it('should handle payload with missing sub or email (if your code allows)', async () => {
      process.env.JWT_SECRET = 'test-secret';
      const strategy = new JwtStrategy();
      const invalidPayload = { email: 'no-sub@example.com' }; 
      // หรือจะให้โยน exception ก็ได้ แล้วแต่การออกแบบ

      const result = await strategy.validate(invalidPayload as any);
      expect(result).toEqual({ userId: undefined, email: 'no-sub@example.com' });
      // หรือถ้าคุณต้องการให้โยน UnauthorizedException
      // ให้แก้ไข JwtStrategy.validate() ให้ตรวจสอบ sub ก่อน แล้ว test ด้วย .rejects.toThrow()
    });
  });
});
