import { RequestHandler } from "express";
import { errMsg, successMsg } from "../util/responseMsg";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import env from "../util/validateEnv";

  /**
   * @swagger
   * /api/users/signup:
   *  post:
   *   tags:
   *   - User
   *   summary: Registration of a user
   *   requestBody:
   *    required: true
   *    content: 
   *      application/json:
   *        schema:
   *          $ref: '#/components/schemas/CreateUserInput'
   *   responses:
   *    200:
   *      description: Success
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateUserResponse'
   *    409:
   *      description: Conflict
   *    400:
   *      description: Bad request
   */
export const signUp: RequestHandler = async (req, res) => {
    const username = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;

        const existingUsername = await User.findOne({ username: username }).exec();

        if (existingUsername) {
           return errMsg(409, 'error', 'username already exist', res)
        }

        const existingEmail = await User.findOne({ email: email }).exec();

        if (existingEmail) {
            return errMsg(409, 'error', 'email already exist', res)
        }

        const passwordHashed = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username: username,
            email: email,
            password: passwordHashed,
        });
        const payload = {
        name: newUser.username,
        email: newUser.email
         }
      
       successMsg(200, 'success', payload, res)
}

export const login: RequestHandler = async (req, res) => {
    const username = req.body.userName;
    const password = req.body.password;

        const user = await User.findOne({ username: username }).select("+password +email").exec();

        if (!user) {
            return errMsg(400, 'error', 'invalid username', res)
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
             return errMsg(400, 'error', 'invalid password', res)
        }

    const payload = {
        name: user.username,
        email: user.email
    }
        const accessToken = jwt.sign(
        payload,
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "username":payload.name },
        env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'none', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

     successMsg(200, 'success', accessToken, res)
};

export const refresh: RequestHandler= (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        env.REFRESH_TOKEN_SECRET,
        async (err: any, decoded: any) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
              { "username": foundUser.username },
                env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        }
    )
}

export const logout: RequestHandler = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
    res.json({ message: 'Cookie cleared' })
}