const Stream = require('node-rtsp-stream');
const streamUrl = "rtsp://210.99.70.120:1935/live/cctv009.stream";

stream = new Stream({
  name: 'foscam_stream',
  streamUrl: streamUrl,
  wsPort: 9999,
//   width: 1080,
//   height: 800
});