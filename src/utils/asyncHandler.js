const asyncHandler=(fn)=>async (req,res,next)=>{
    try{
await fn(req,res,next)
    }catch(e){
        res.status(e.statusCode ||500).json({
            success:e.success||false,
            message:e.message||"Internal Error",
            data:e.data||null
        })
    }
}

export {asyncHandler}