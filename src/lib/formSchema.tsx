

// Formのスキーマ、TypeScriptの型を定義

import { z } from "zod";

// ファイルサイズの上限を定義
const MAX_MB = 10; // メガバイト
const MAX_FILE_SIZE = MAX_MB * 1024 * 1024; // バイトに変換
// → 5メガバイトをバイトに変換するために、5を1024と1024で乗算して計算

// 画像の拡張子の指定
const ACCEPTED_IMAGE_TYPE = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

// フォームのスキーマ

export const formSchema = z.object({
  username: z.string().min(2, { message: "ユーザー名は2文字以上で入力してください。"} ),
  subject: z.string().min(2, { message: "主題は2文字以上で入力してください。" }),
  
  // メールは正規表現でスキーマを定義するがzodはその辺りも考慮してくれている
  // email() 適切なメールアドレスではない場合はエラーを出す
  email: z.string().email({ message: "適切なメールアドレスを入力してください。" }),
  content: z
  .string()
  .min(10, { message: "本文は10文字以上で入力してください。" })
  .max(160, { message: "本文は160文字以上で入力してください。" }),

  // file(ここでは画像)のスキーマ。
  // → 用意されていないのでカスタムで作る
  file: z.custom<FileList>()
  .refine((files) => files?.length > 0, "ファイル画像が必要です。")
  // → files?.length > 0がfalseの時に、バリデーションエラーが出る仕様
  .refine(
    (files) => {
      // console.log(files?.[3])
      return files?.[0].size <= MAX_FILE_SIZE
    },
    `画像サイズは${MAX_FILE_SIZE}MBまでです。`
  )
  .refine(
    files => ACCEPTED_IMAGE_TYPE.includes(files?.[0]?.type),
    ".jpg、.jpeg、.png, .webpの拡張子の画像のみ添付可能です。"
  )

})



