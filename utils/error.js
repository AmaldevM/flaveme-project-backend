const handleError = async (error,req,res, next) => {
    try {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went Wrong, Please try again";

        res.status(statusCode).json({ message });
    } catch (error) {
        res.status(error.statusCode || 500).json({message: error.message || "Internal Server Error"})
    }
}

module.exports = ( handleError ) 