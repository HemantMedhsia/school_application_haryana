import { ApiError } from "../Utils/errorHandler.js";

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.role)) {
        // return res.status(403).json({ message: 'Access denied' });
        return next (new ApiError (403, "Access Denied"));
      }
      next();
    };
  }
  
  export {authorizeRoles};