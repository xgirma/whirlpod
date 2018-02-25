# Whirlpod

Routes

## GET /api/
Return "OK"

## GET /api/channels
Return all channels data.

## GET /api/pods
Return all pods.

## GET /api/pods/ten/:type
Return ten recent or liked podcasts.

## GET /api/pods/:title/:type
Return ten recent or liked pods of a playlist.

## POST /api/pods/:id
Increment like by one.

## POST /api/pods?url=http://dhenage.libsyn.com/rss
Post multiple pods.

## POST /api/channels?url=http://dhenage.libsyn.com/rss
Post a single channel data.

# Example Feeds

```json
{
  "Crypto-Gram": "http://dhenage.libsyn.com/rss",
  "SecurityWeekly": "http://feeds.feedburner.com/securityweekly/XBIC",
  "SecurityNow": "http://feeds.twit.tv/sn_video_hd.xml"
}
```
