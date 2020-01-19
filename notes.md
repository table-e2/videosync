# Notes

Functions:

- Get page
  - Return HTML
- Get watch page
  - Return HTML with video
- Get server time
  - Return server time now
- Upload
  - File
  - Password
  - Return the URL
- Request host
  - File
  - Password
  - If good, return host token
- Websocket
  - Send seek/play/pause
    - Token
    - Video timestamp
  - Receive seek/play/pause
    - Video timestamp
    - Time to start

Structure

```json
{
    "type": "seek|play|pause",
    "video_timestamp": 1234,
    "execute_time": 4567,
    "token": "abcd1234",
    "server_time": 7549785
}
```

Paths

- `kitchensync.tech` Landing page
  - `/faucet` Websocket
  - `GET /watch/{video_id}` Watch page
  - `/api/v1`
    - `POST /upload` Start a new session
    - `POST /host` Request host token with password
