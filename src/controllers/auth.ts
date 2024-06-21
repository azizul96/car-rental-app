import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const signUp = async (req: Request, res: Response) => {
  const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    role: z.enum(['user', 'admin']),
    password: z.string().min(6),
    phone: z.string(),
    address: z.string(),
  });

  try {
    const validatedData = userSchema.parse(req.body);
    const userExists = await User.findOne({ email: validatedData.email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const user = new User({ ...validatedData, password: hashedPassword });
    await user.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation Error',
        errorMessages: error.errors,
      });
    } else {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
};

const signIn = async (req: Request, res: Response) => {
  const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  try {
    const validatedData = signInSchema.parse(req.body);
    const user = await User.findOne({ email: validatedData.email });

    if (
      !user ||
      !(await bcrypt.compare(validatedData.password, user.password))
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      'your_jwt_secret',
      {
        expiresIn: '24h',
      },
    );

    res.json({
      success: true,
      statusCode: 200,
      message: 'User signed in successfully',
      data: { token, user },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation Error',
        errorMessages: error.errors,
      });
    } else {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
};

export { signUp, signIn };
