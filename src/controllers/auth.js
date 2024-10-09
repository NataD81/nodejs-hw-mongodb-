import { ONE_DAY } from '../constants/index.js';
import { loginUser, logoutUser, refreshUsersSession, registerUser } from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const { body } = req;
  const user = await registerUser(body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
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
