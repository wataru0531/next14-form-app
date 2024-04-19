

// route.tsxのAPIに使う

interface EmailTemplateProps {
  username: string
  email: string,
  content: string
}

import * as React from 'react';

// Readonly ... 読み取り専用。
// Reactのpropsは基本的に読み取り専用だが、typescriptで明示的に表示している
export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>>= ({ username, email, content }) => {

  return(
    <div>
      <h1>こんにちは、{ username }</h1>
      <p>{ email }から届きました。</p>
      <p>{ content }</p>
    </div>
  )
}