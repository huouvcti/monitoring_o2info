const Stream = require('node-rtsp-stream');
const streamUrl = "rtsp://210.99.70.120:1935/live/cctv009.stream";

stream = new Stream({
  name: 'foscam_stream',
  streamUrl: streamUrl,
  wsPort: 9999,
//   width: ,
//   height: 100
});


// ffmpeg -rtsp_transport tcp -i rtsp://210.99.70.120:1935/live/cctv009.stream -vcodec libx264 -hls_flags delete_segments  test.m3u8

// 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