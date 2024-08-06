const { prisma } = require('../prisma/prisma-client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');

/**
 * @route POST /api/user/login
 * @desс login
 * @access Public
 */

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).json({ message: 'please fill required fields' });
  }

  const user = await prisma.user.findFirst({ where: { email } });

  const isPasswordCorrect =
    user && (await bcrypt.compare(password, user.password));

  if (isPasswordCorrect) {
    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } else {
    return res.status(403).json({ message: 'wrong email or password' });
  }
};

/**
 *
 * @route POST /api/user/register
 * @desc register
 * @access Public
 */

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email && !password && !name) {
      return res.status(400).json({ message: 'please fill required fields' });
    }

    const userWithSameEmail = await prisma.user.findFirst({ where: { email } });

    if (userWithSameEmail) {
      return res
        .status(400)
        .json({ message: 'user with this email already exist' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    const secret = process.env.JWT_SECRET;

    if (user && secret) {
      res.status(201).json({
        id: user.id,
        email: user.email,
        name,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: '30d' }),
      });
    } else {
      return res.status(400).json({ message: 'cant create user' });
    }
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' });
  }
};

const current = async (req, res, next) => {
  res.send('current');
};

module.exports = { login, register, current };
