import { Request, Response } from "express";

export const uploadImage = (
  req: Request,
  res: Response
) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image uploaded.",
    });
  }

  res.status(200).json({
    success: true,

    image: req.file.filename,

    url:
      "http://localhost:5000/uploads/products/" +
      req.file.filename,
  });
};