import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';



//register
export const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email });
        if (checkUser) return res.json({
            success: false,
            message: "User Already Exists ,Please Login in"
        });
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ userName, email, password: hashPassword });
        await newUser.save();
        res.status(200).json({
            success: true,
            message: "Registration Successfull"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occured',
        });
    }
};

//login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email });
        if (!checkUser) return res.json({
            success: false,
            message: "User Doesn't Exists ! Please Register"
        });

        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
        if (!checkPasswordMatch) return res.json({
            success: false,
            message: "Invalid Password , Please try again"
        });

        const token = jwt.sign({
            id: checkUser._id,
            role: checkUser.role,
            email: checkUser.email,
            userName: checkUser.userName
        }, 'CLIENT_SECRET_KEY', { expiresIn: '60min' });
        // res.cookie('token', token, { httpOnly: true, secure: true }).json({
        //     success: true,
        //     message: "Logged in Successfully !",
        //     user: {
        //         email: checkUser.email,
        //         role: checkUser.role,
        //         id: checkUser._id,
        //         userName: checkUser.userName
        //     }
        // });


        //As per 'Render.com' session store via cookie not working so tried below way to fix the issue
        res.status(200).json({
            success: true,
            message: 'Logged in Successfully...',
            token,
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                userName: checkUser.userName
            },
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occured',
        });
    };
};



//logout
export const logoutUser = (req, res) => {
    res.clearCookie('token').json({
        success: true,
        message: "Logged out Successfully !"
    })
}


//auth middleware
//COokie based but not wokring with Render.com so following second approach

// export const authMiddleware = async (req, res, next) => {
//     const token = req.cookies.token;
//     if (!token) return res.status(401).json({
//         success: false,
//         message: " unauthorised User !"
//     })
//     try {
//         const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({
//             success: false,
//             message: "unauthorised user!"
//         });
//     };
// };


export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({
        success: false,
        message: " unauthorised User !"
    })
    try {
        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "unauthorised user!"
        });
    };
};
