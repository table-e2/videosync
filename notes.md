# Notes

Functions:

- Get page
  - Return HTML
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
    "token": "abcd1234"
}
```
