# Fatty-Autocomleted-Blog

A Funny Repo using **React(Next.js)** , css framework **Tailwindcss**, Database **MongoDB** , deploy by **Vercel**.

網站連結：[fatty-autocomleted-blog](https://fatty-autocomleted-blog.vercel.app/)

### 目錄

- [專案簡介](#專案簡介)
- [目錄結構說明](#目錄結構說明)
- [第三方套件使用](#第三方套件使用)

## 專案簡介

```
適逢ChatGPT熱潮，試做看看。

設定文章主題及關鍵字後，openai會自動幫你生成一篇經過seo優化的文章。

由於ChatGPT對中文支援不高，
生成文章需耗時大約一分鐘，請耐心等待。
```

---

## 目錄結構說明

1. components

   - AppLayout

   - Logo

2. context

   - action.js
   - reducer.js
   - postsProvider.js

3. pages

- api

  - auth

    - [...auth].js

  - webhooks

    - stripe.js

  - deletePost.js

  - generatePost.js

  - getPosts.js

  - popupTokens.js

- post

  - [postId]

  - new

- success

- token-popup

- \_app.js

- index.js

4. db

- mongodb.js

5. styles

- globals.css

6. lib

   - getAppProps.js

   - openaiConfig.js

7. .env.local

8. package.json

9. tailwind.config.js

10. next.config.js

---

## 第三方套件使用

- auth0
- fontawesome
- micro-cors
- mongodb
- stripe
- openai

---
