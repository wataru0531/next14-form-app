
// フォームのバリデーションのカスタムフック

import { useCallback } from 'react';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from "zod";
import { formSchema } from '@/lib/formSchema'


export const useMailForm = () => {

  // フォームの状態を管理するためのオブジェクトを生成
  // useForm → フックを使用してフォームの状態を管理
  //           フォームの入力値、バリデーション、送信処理などの操作を行うためのメソッドやプロパティを提供
  // zodResolver → フォームのバリデーションを行う
  //               Zodライブラリを利用してフォームデータをバリデーションするための解決関数
  //               resolver...useFormフックのオプション。フォームのバリデーションを行うための関数で、ここではzodResolverを使用
  //               zodResolver()...スキーマを受け取り、フォームデータをスキーマに従って検証
  const form = useForm<z.infer<typeof formSchema>>({ // z.infer ... 型を抽出
    resolver: zodResolver(formSchema),
    defaultValues: { // デフォルトの値
      username: "",
      subject: "",
      email: "",
      content: "",
      file: undefined, // 文字列ではないので未定義とする
    }
  });
  // console.log(form) // {control: {…}, trigger: ƒ, register: ƒ, handleSubmit: ƒ, watch: ƒ, …}

  // useCallbackでのメモ化 関数の再生成を防ぐ
  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => { 
    // values ... フォームのinput、textareaなどの値が渡ってくる
    const { username, subject, email, content, file } = values;
    // console.log(values) // {username: 'やす', subject: 'first cliek', email: 'obito0531@gmail.com', content: 'firser content\n'}
    // console.log(username, subject, email, content, file);

    // FormDataオブジェクト
    // appendで追加されたものが適切な形でエンコードされて、正しく送信されるために使う。
    // Webアプリケーションでフォームデータを操作するためのオブジェクト
    // 画像などを含むデータを送信する場合や、multipart/form-dataエンコーディングが必要な場合は、FormDataを使わないとリクエストが正しくフォーマットされない可能性がある
    // 単なるテキストなどはjson形式で問題ないが画像などはformDataでバイナリ形式に変換して転送する必要がある。

    // multipart/form-data
    // → HTTPリクエストの一種で、フォームデータを送信する際に使われるエンコード形式
    //   特に、フォームデータにファイルが含まれている場合に使用されることが一般的
    const formData = new FormData();
    formData.append("username", username); // append キーと値で格納
    formData.append("subject", subject);
    formData.append("email", email);
    formData.append("content", content);
    formData.append("file", file[0]); // 

    try {
      // 変数の「 NEXT_PUBLIC 」→ クライアントサイドでも変数を利用可能とする
      // NEXT_PUBLICのプレフィックスがついていたければ、デフォルトでサーバーサイドのみで利用され、
      // クライアントサイドでは読み込みが不可能
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send`, {
        method: "POST",
        // formDataを使っているので今回はheadersは使わない
        // headers: {
          // リクエストのbodyがjson形式だとサーバーに示す
          // JSON形式はデフォルトでUTF-8エンコーディングを使用するため、日本語などの非ASCII文字も適切に扱うことができる
          // → これにより、返却されるデータなどが文字化けされなくなる
          // "Content-Type": "application/json"
        // },
        body: formData, // JSON形式ではなくformDataオブジェクトを渡す(バイナリデータで転送)
        
        // body: JSON.stringify({ // json形式に変換 → 画像があるのでテキスト形式では転送できない。バイナリデータで転送する
        //   username,
        //   email,
        //   subject,
        //   content,
        //   file,
        // })
      })

    } catch (error) {
      console.log(error)
    }
  }, [])

  return {
    form,
    onSubmit,
  }
}
