
// フォーム
// 使用ライブラリ React Hook Form、zod、shadcn、
// shadcnのフォームはReac Hook Formと組み合わせないとエラーが出る
// 

"use client"

import React, { useEffect } from 'react'
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage,  
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { useMailForm } from "../../hooks/useMailForm";
import PacmanLoader from "react-spinners/PacmanLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MailForm = () => {
  // const result = useMailForm();
  // console.log(result) // { form: {…}, onSubmit: ƒ }

  const { form, onSubmit } = useMailForm();
  // console.log(form) // {control: {…}, trigger: ƒ, register: ƒ, handleSubmit: ƒ, watch: ƒ, …}clearErrors: (name) => {…}control: {register: ƒ, unregister: ƒ, getFieldState: ƒ, handleSubmit: ƒ, setError: ƒ, …}formState: {…}getFieldState: (name, formState) => {…}getValues: (fieldNames) => {…}handleSubmit: (onValid, onInvalid) => {…}register: (name, options = {}) => {…}reset: (formValues, keepStateOptions) => {…}resetField: (name, options = {}) => {…}setError: (name, error, options) => {…}setFocus: (name, options = {}) => {…}setValue: (name, value, options = {}) => {…}trigger: async (name, options = {}) => {…}unregister: (name, options = {}) => {…}watch: (name, defaultValue) => {…}[[Prototype]]: Object
  
  // フォーム送信後にトーストを表示
  useEffect(() => {
    // フォーム送信が成功した時だけトーストを表示
    if(form.formState.isSubmitSuccessful) toast.success("submit success !!");

  }, [ form.formState.isSubmitSuccessful ])

  return (
    // ...form
    // shadcnのバリデーション機能で内部の仕組み
    <Form {...form}>
      <ToastContainer />

      <form onSubmit={form.handleSubmit(onSubmit)} className="container flex flex-col gap-3">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => {
            // console.log(field) // {name: 'username', value: 'waar', onChange: ƒ, onBlur: ƒ, ref: ƒ}

            return (
              <FormItem>
                <FormLabel>ユーザー名</FormLabel>
                <FormControl>
                  <Input placeholder="ユーザー名" {...field} />
                </FormControl>

                {/* FormMessage ... バリデーションチェックのエラー文 */}
                <FormMessage />
              </FormItem>
            )
          }}

          // render={({ field }) => (
          //   <FormItem>
          //     <FormLabel>ユーザー名</FormLabel>
          //     <FormControl>
          //       <Input placeholder="ユーザー名" {...field} />
          //     </FormControl>

          //     {/* FormMessage ... バリデーションチェックのエラー文 */}
          //     <FormMessage />
          //   </FormItem>

          // )}
          
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input placeholder="メールアドレス" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>

          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>主題</FormLabel>
              <FormControl>
                <Input placeholder="主題" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>

          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>本文</FormLabel>
              <FormControl>
                <Textarea placeholder="本文" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>

          )}
        />

        <FormField
          control={form.control}
          name="file"
          // fieldオブジェクトからonChangeプロパティと他の全てのプロパティ(fieldProps)を分割代入して取得
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>添付画像</FormLabel>
              <FormControl>
                <Input 
                  /* 画像ファイルだけ許可。全ては、* を指定 */
                  accept="image/*" 
                  type="file" 
                  placeholder="ファイル" 
                  onChange={(e) => {
                    // console.log(e.target.files)
                    // fileオブジェクトにアクセス
                    onChange(e.target.files)
                  }}
                  {...fieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit"
          disabled={form.formState.isSubmitting} // trueの時が押せない
          
        >
          { form.formState.isSubmitting ? <PacmanLoader color="#36d7b7"/> : "submit" }
        </Button>

        
      </form>
    </Form>
  )
}

export default MailForm