export default (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error,next) => {
            res.status(500).json({
                success: false,
                message: error.message,
            });
            next;
        });
    };
};
