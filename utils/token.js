import jwt from 'jsonwebtoken'

export const generateToken = (user,role) => {
    try {
        var token = jwt.sign({ id: user._id , role:role },process.env.JWT_SECRET_KEY);
        return token
    } catch (error) {
        console.log(error);
    }
};
