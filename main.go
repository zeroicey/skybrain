package main

import (
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
)

// CORS 中间件：解决浏览器 hls.js 播放时的跨域拦截问题
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Range, Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// 启动推流守护进程
func startStream(channelName, videoPath string) {
	// 1. 创建频道专属的输出目录
	outDir := filepath.Join("output", channelName)
	err := os.MkdirAll(outDir, 0755)
	if err != nil {
		log.Fatalf("无法创建输出目录 %s: %v", outDir, err)
	}

	m3u8Path := filepath.Join(outDir, "index.m3u8")
	log.Printf("开始推流频道: %s (视频: %s)", channelName, videoPath)

	// 2. 组装 FFmpeg 命令 (重点修复区域)
	cmd := exec.Command("ffmpeg",
		"-stream_loop", "-1", // 无限循环播放，模拟 24/7 直播
		"-re",           // 【关键】以视频原生帧率读取，防止瞬间推完导致时间戳错乱
		"-i", videoPath, // 输入文件
		"-c:v", "libx264", // 强制转码为 H.264，保证浏览器兼容性
		"-c:a", "aac", // 强制转码音频为 AAC
		"-preset", "veryfast", // 降低转码 CPU 占用
		"-f", "hls", // 输出格式为 HLS
		"-hls_time", "4", // 每个 ts 切片 4 秒
		"-hls_list_size", "5", // m3u8 播放列表只保留最新 5 个切片 (直播模式)
		"-hls_flags", "delete_segments", // 【关键】自动删除旧的 ts 文件，防止硬盘撑爆
		m3u8Path,
	)

	// 将 ffmpeg 的错误输出打印到控制台，方便排查报错
	cmd.Stderr = os.Stderr

	// 运行命令
	if err := cmd.Run(); err != nil {
		log.Printf("频道 %s 推流意外结束: %v", channelName, err)
	}
}

func main() {
	// 1. 确保环境清理 (每次启动清理旧的切片，防止旧时间戳污染新流)
	os.RemoveAll("output")

	// 2. 启动频道的推流协程
	go startStream("channel_01", filepath.Join("videos", "movie1.mp4"))
	go startStream("channel_02", filepath.Join("videos", "movie2.mp4"))

	log.Println("所有频道守护进程已启动，系统运行中...")

	// 3. 启动静态文件服务器
	// 这样配置后，http://localhost:8888/channel_01/index.m3u8
	// 会自动映射到本地的 output/channel_01/index.m3u8，并且能正确下载 .ts 文件
	fs := http.FileServer(http.Dir("./output"))
	http.Handle("/", corsMiddleware(fs))
	// ... 之前的代码 ...
	log.Println("HTTP 服务已启动，监听端口: 8889")                               // 修改这里的提示语
	log.Println("测试播放链接: http://localhost:8889/channel_01/index.m3u8") // 修改这里的提示语

	err := http.ListenAndServe(":8889", nil) // 关键：把这里改成 :8889
	if err != nil {
		log.Fatalf("HTTP 服务器启动失败: %v", err)
	}
}
