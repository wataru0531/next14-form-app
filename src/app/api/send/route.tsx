

// コンタクトフォームのAPI
// useMailFormから叩かれる

import { EmailTemplate } from "@/components/email-template";
import { NextResponse } from "next/server";
import React from "react";
import { Resend } from "resend";

// Resend APIを用いてメール送信するためのクライアントを初期化。
// このインスタンスのメソッドを使ってメールを送信する
const resend = new Resend(process.env.RESEND_API_KEY);

// request ... 送信する時にemailやsubjectを受け取るので引数に設定
export async function POST(request: Request){ // 問い合わせはPOST
  // console.log(resend) // Resend { key: "re_8ZnJ...", apiKeys: ApiKey: {resend: [Circular *1], ..... } }

  // json形式をパースして、オブジェクト形式に変換 → formDataを使った場合は使わない。
  // console.log(request) // NextRequest [Request] {...}
  // const { username, subject, email, content, file } = await request.json()

  // formDataを使った場合のデータの受け取り方
  // 画像などのfileを転送したり保存したりする場合はバイナリデータに変換して保存する
  // → バイナリデータは、ファイルの元の形式を保ちながら、コンピューターが理解できる形で保存や転送が可能
  //   ファイルをテキスト形式で転送すると、元のファイルのデータが改変される可能性がある。
  //   formDataオブジェクトを使うことで適切な形で転送され保存される
  const formData = await request.formData();
  // console.log(formData)
  const username = formData.get("username") as string;
  const subject  = formData.get("subject") as string;
  const email    = formData.get("email") as string;
  const content  = formData.get("content") as string;
  const file     = formData.get("file") as File;
  // console.log(username, subject, email, content, file);

  // バイナリデータに変換
  // Buffer.from() バッファオブジェクトに変換
  // バッファ
  // → 特にNode.jsなどのサーバーサイドJavaScriptでよく使われる
  //   ファイルの内容やネットワークからのデータなど、バイナリデータを格納するためのデータ構造
  const buffer = Buffer.from(await file.arrayBuffer());
  // console.log(buffer) // <Buffer 52 49 46 ... 69 6e e1 76 ... 3792 more bytes>
  // → このようにfileはバッファの状態で転送する

  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // どこから。例: サイト名
      to: ["obito0531@gmail.com"], // 受け取る人
      subject: subject, // タイトル
      react: EmailTemplate({ // api/send/routeの関数
        username: username, // 送信者の名前
        email: email, 
        content: content,
      }) as React.ReactElement,
      // EmailTemplate()は、React.FC<Readonly<EmailTemplateProps></EmailTemplateProps>>型の関数なので、
      // 通常その関数が返す値はReact.ReactElementのインスタンス。
      // しかし、TypeScriptが推測する型が適切でない場合や明示的に型を示したい場合に、
      // as React.ReactElementとキャストすることで、TypeScriptに値がReact.ReactElementであると伝えている
      attachments: [{  // 画像などを添付
        filename: file.name, // fileの画像の名前
        // 画像データを含めるところ → 画像をバイナリデータ(0か1)に置き換える →
        // バッファーに格納して、そのバッファをcontentに含めて送信する
        content: buffer, // バイナリデータで転送する
      }],

    })

    if(error) {
      return NextResponse.json({ error })
    }

    return NextResponse.json({ data });
    
  } catch (error) {
    return NextResponse.json({ error })
  }

}
