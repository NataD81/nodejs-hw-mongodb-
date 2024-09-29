import createHttpError from 'http-errors';

import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
    try {
        console.log('Authorization Header:', req.get('Authorization'));
        const authHeader = req.get('Authorization');

        if (!authHeader) {
           throw createHttpError(401, 'Please provide Authorization header');

        }

        const [bearer, token] = authHeader.split(' ');


        if (bearer !== 'Bearer' || !token) {
          throw createHttpError(401, 'Auth header should be of type Bearer');

        }

        const session = await SessionsCollection.findOne({ accessToken: token });
        console.log('Session:', session);
        if (!session) {
          throw createHttpError(401, 'Session not found');

        }

        const isAccessTokenExpired =
          new Date() > new Date(session.accessTokenValidUntil);

        if (isAccessTokenExpired) {
          throw createHttpError(401, 'Access token expired');
        }

        const user = await UsersCollection.findById(session.userId);

        if (!user) {
          throw createHttpError(401);

        }

        req.user = user;

        next();
    } catch (error) {
        next (error);

    }

};
