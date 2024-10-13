
import createHttpError from 'http-errors';
import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { THIRTY_DAYS } from '../constants/index.js';
import { refreshUsersSession } from '../services/auth.js';
import { logoutUser } from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw createHttpError(
      400,
      'Missing required fields: name, email or password',
    );
  }

  const user = await registerUser({ name, email, password });


  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',

    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createHttpError(400, 'Missing required fields: email or password');
  }

  const session = await loginUser({ email, password });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
=======
    data: {
      name: user.name,
      email: user.email,

    }
  });
};
const setupSession = (session, res ) => {
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });
  };

  export const logoutUserController = async (req, res) => {

    const { sessionId } = req.cookies;
    if (sessionId) {
      await logoutUser(sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  };
  export const loginUserController = async (req, res, next) => {
    const { body } = req;
    const session = await loginUser(body);

    setupSession(session, res);

    res.status(201).json({
      status: 201,
      message: 'Successfully logged in an user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  };

  export const refreshUserSessionController = async (req, res, next) => {
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    setupSession(session, res);

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  };

