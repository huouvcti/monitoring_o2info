const Stream = require('node-rtsp-stream');

const streamUrl = [
    
    "rtsp://admin:Haeri5515!@o2.iptime.org:5575/Streaming/Channels/201",
    "rtsp://admin:Haeri5515!@o2.iptime.org:5575/Streaming/Channels/301",
    "rtsp://admin:Haeri5515!@o2.iptime.org:5575/Streaming/Channels/401",

    "rtsp://210.99.70.120:1935/live/cctv009.stream",

    "rtsp://admin:Haeri5515!@o2.iptime.org:5575/Streaming/Channels/101",

]

let stream0 = new Stream({
  name: 'foscam_stream',
  streamUrl: streamUrl[0],
  wsPort: 8500,
//   width: ,
//   height: 100
});

let stream1 = new Stream({
    name: 'foscam_stream',
    streamUrl: streamUrl[1],
    wsPort: 9001,
});

let stream2 = new Stream({
    name: 'foscam_stream',
    streamUrl: streamUrl[2],
    wsPort: 9002,
});

let stream3 = new Stream({
    name: 'foscam_stream',
    streamUrl: streamUrl[3],
    wsPort: 9003,
});

let stream4 = new Stream({
    name: 'foscam_stream',
    streamUrl: streamUrl[4],
    wsPort: 9004,
});






// ffmpeg -rtsp_transport tcp -i rtsp://210.99.70.120:1935/live/cctv009.stream -vcodec libx264 -hls_flags delete_segments  test.m3u8

// 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

//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