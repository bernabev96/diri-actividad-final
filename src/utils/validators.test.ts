import { describe, expect, it } from 'vitest';
import { classSessionSchema, loginSchema, registerSchema } from './validators';

describe('validators', () => {
  it('accepts a valid login form', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '123456',
    });

    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: '123456',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a register form with a short name', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      name: 'A',
      password: '123456',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a class date before today', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const result = classSessionSchema.safeParse({
      active: true,
      capacity: 10,
      date: yesterday,
      time: '18:00',
      title: 'Cross training',
      trainer: 'Laura',
    });

    expect(result.success).toBe(false);
  });
});
