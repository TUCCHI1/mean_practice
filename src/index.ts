import { Express, Request, Response, urlencoded } from "express";

const express = require("express");
const app: Express = express();

app.use(urlencoded({ extended: true }));
app.use(express.json());

const jwt = require("jsonwebtoken");
const auth = require("./utils/auth");

const { connectDB } = require("./utils/database");
const { ItemModel, UserModel } = require("./utils/schemaModels");

// ITEM functions
// Create Item
app.post("/item/create", auth, async (req: Request, res: Response) => {
  try {
    await connectDB();
    await ItemModel.create(req.body);
    return res.status(200).json({ message: "アイテム作成成功" });
  } catch (err) {
    return res.status(400).json({ message: "アイテム作成失敗" });
  }
});
// Read All Itens
app.get("/", async (req: Request, res: Response) => {
  try {
    connectDB();
    const allItems = await ItemModel.find();
    return res.status(200).json({
      message: "アイテム読み取り成功（オール）",
      allItems: allItems,
    });
  } catch (err) {
    return res.status(400).json({
      message: "アイテム読み取り失敗（オール）",
    });
  }
});
// Read Single Item
app.get("/item/:id", async (req: Request, res: Response) => {
  try {
    await connectDB();
    const singleItem = await ItemModel.findById(req.params.id);
    return res.status(200).json({
      message: "アイテム読み取り成功（シングル）",
      singleItem: singleItem,
    });
  } catch (err) {
    res.status(400).json({
      message: "アイテム読み取り失敗（シングル）",
    });
  }
});
// Update Item
app.put("/item/update/:id", auth, async (req: Request, res: Response) => {
  try {
    await connectDB();
    await ItemModel.updateOne({ _id: req.params.id }, req.body);
    return res.status(200).json({
      message: "アイテム編集成功",
    });
  } catch (err) {
    return res.status(400).json({
      message: "アイテム編集失敗",
    });
  }
});
// Delete Item
app.delete("/item/delete/:id", auth, async (req: Request, res: Response) => {
  try {
    await connectDB();
    await ItemModel.deleteOne({ _id: req.params.id });
    return res.status(200).json({ message: "アイテム削除成功" });
  } catch (err) {
    return res.status(400).json({
      message: "アイテム削除失敗",
    });
  }
});

// USER functions
// Register User
app.post("/user/register/", async (req: Request, res: Response) => {
  try {
    await connectDB();
    await UserModel.create(req.body);
    return res.status(200).json({
      message: "ユーザー登録成功",
    });
  } catch (err) {
    return res.status(400).json({
      message: "ユーザー登録失敗",
    });
  }
});
// Login User
const secret_key = "mern-market";

app.post("/user/login", async (req: Request, res: Response) => {
  try {
    await connectDB();
    const savedUserData = await UserModel.findOne({ email: req.body.email });
    if (savedUserData) {
      if (req.body.password === savedUserData.password) {
        const payload = {
          email: req.body.email,
        };
        const token = jwt.sign(payload, secret_key, { expiresIn: "23h" });
        console.log(token);
        return res.status(200).json({
          // パスワードが正しい場合の処理
          message: "ログイン成功",
        });
      } else {
        // パスワードが間違っている場合の処理
        return res.status(400).json({
          message: "ログイン失敗: パスワードが間違っています",
        });
      }
    } else {
      // ユーザーデータが存在しない場合の処理
      return res.status(400).json({
        message: "ログイン失敗: ユーザー登録をしてください",
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: "ログイン失敗: ユーザー登録をしてください",
    });
  }
});

app.listen(5000, () => {
  console.log("Listening on localhost port 5000");
});
