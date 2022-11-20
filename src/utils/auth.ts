export const auth = async (req: any, res: any, next: any) => {
  if (req.method === "GET") {
    return next();
  }

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InR1dGlraWtpbjFAZ21haWwuY29tIiwiaWF0IjoxNjY4OTExMDkzLCJleHAiOjE2Njg5OTM4OTN9.yxoobV2MTjUxjxmn79cjb9UKoxJ7gI2-HuIL7bzDFJw";
  // const token = await req.headers.authorization.split(" ")[1];
  const jwt = require("jsonwebtoken");
  const secret_key = "mern-market";

  if (!token) {
    return res.status(400).json({
      message: "トークンがありません",
    });
  }

  try {
    const decoded = jwt.verify(token, secret_key);
    req.body.email = decoded.email;
    return next();
  } catch (err) {
    return res.status(400).json({
      message: "トークンが正しくないので、ログインしてください",
    });
  }
};
