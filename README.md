# 알림톡 발송 서버

NHN 클라우드의 카카오톡 비즈메시지를 사용함.

## Requirements

node.js v19.9.0

## How to Run

`example.env`파일을 참조해서 .env 세팅

```sh
npm i
npm run start
```

## Send Message

```json
body
{
  "templateCode": "templete_code",
  "recipients": [
    {
      "phoneNumber": "01012345678",
      "params": {
        "name": "홍길동",
        "order_no": "KD20240801",
        "product_name": "스마트 워치",
        "payment_date": "2024-08-01"
      }
    }
  ]
}
```
