const constant=require("../constants");
const errorHandler=(err,req,res,next)=>{
    const status= res.statusCode && res.statusCode !== 200?res.statusCode:500;
    const payload = (title) => ({
      title,
      message: err.message,
      ...(process.env.NODE_ENV !== "production" ? { stackTrace: err.stack } : {}),
    });
  switch (status) {
    case constant.VALIDATION_ERROR:
        res.status(status).json(payload("validation failed"));
        break;
    case constant.NOT_FOUND:
        res.status(status).json(payload("not found"));
        break;
    case constant.UNAUTHORIZED:
           res.status(status).json(payload("unauthorised"));
        break;
    case constant.FORBIDDEN:
        res.status(status).json(payload("forbidden"));
        break;
    case  constant.SERVER_ERROR:
        res.status(status).json(payload("server error"));
        break;
    default:
        res.status(500).json({
        title: "Unknown error",
        message: err.message
    });
        break;
  }
};
module.exports=errorHandler;