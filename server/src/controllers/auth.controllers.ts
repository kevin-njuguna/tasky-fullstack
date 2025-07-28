import {NextFunction, Request, Response} from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const client = new PrismaClient()

export const register = async (req: Request, res: Response) => {
try {
    const {firstName, lastName, email, username, password} = req.body
    
    const hashedPassword = await bcrypt.hash(password,10)
    
    
    const users = await client.user.create({
        data: {
            firstName,
            lastName,
            email,
            username,
            password : hashedPassword
        },
    })

    
    return res.status(201).json("User created succesfully")
    
    

} catch(e) {
    console.log(e)
    return res.status(400).json("Something went wrong")
}
}



export const  login = async(req: Request, res: Response) => {
try {
    const {identifier, password} = req.body

    const user = await client.user.findFirst({
    where: {
        OR: [{username:identifier}, {email: identifier}]
    }
})

if (!user) {
    res.status(400).json({message: "Failed. Wrong login credentials"});
    return;
}

const passwordMatch = await bcrypt.compare(password, user.password)

if (!passwordMatch) {
    res.status(400).json({message: "Failed. Wrong login credentials!"})
}

const {password: loginPassword, dateJoined, lastProfileUpdate, ...userDetails} = user

const token = jwt.sign(userDetails, process.env.JWT_SECRET!);


 res
      .cookie("authToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        //maxAge: 7 * 24 * 60 * 60 * 1000, 
      })
      .json(userDetails); 
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Something went wrong!" });
  }
};

export const logout = (_req: Request,res: Response) => {
    res.clearCookie('authToken')
    res.status(200).json({message: "Logged out succesfully!"})
}



export interface AuthRequest extends Request {
    user?: any;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.cookies.authToken
    if (!token) {
        return res.status(400).json({message: "Unauthorized!"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!)
        req.user = decoded;
        next()
    } catch {
        res.status(401).json({message: "Invalid token"})
    }
}