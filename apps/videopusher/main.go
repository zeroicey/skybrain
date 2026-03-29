package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"
)

// 支持的视频文件扩展名
var videoExtensions = []string{".mp4", ".avi", ".mkv", ".mov", ".flv", ".wmv"}

type Channel struct {
	Name  string // channel 名称，如 "1", "canteen/1"
	Path  string // 视频文件完整路径
	Scene string // 场景标识: "root", "canteen", "street" 等
}

// ChannelInfo API 响应结构体
type ChannelInfo struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Scene string `json:"scene"`
}

// ChannelResponse API 响应包装
type ChannelResponse struct {
	Channels []ChannelInfo `json:"channels"`
}

// isVideoFile 检查文件是否为视频文件
func isVideoFile(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	for _, v := range videoExtensions {
		if ext == v {
			return true
		}
	}
	return false
}

// scanVideosDir 扫描 videos 目录，返回所有 channel
// 根目录视频映射到 "1", "2", "3"...
// 场景子目录视频映射到 "canteen/1", "canteen/2"...
func scanVideosDir() []Channel {
	var channels []Channel
	videosDir := "videos"

	// 检查目录是否存在
	if _, err := os.Stat(videosDir); os.IsNotExist(err) {
		log.Printf("警告: videos 目录不存在")
		return channels
	}

	// 1. 扫描根目录视频
	rootFiles, err := os.ReadDir(videosDir)
	if err != nil {
		log.Fatalf("无法读取 videos 目录: %v", err)
	}

	var rootVideos []string
	for _, f := range rootFiles {
		if !f.IsDir() && isVideoFile(f.Name()) {
			rootVideos = append(rootVideos, f.Name())
		}
	}

	// 按文件名排序
	sort.Strings(rootVideos)

	// 分配根目录 channel
	for i, filename := range rootVideos {
		channels = append(channels, Channel{
			Name:  string(rune('1' + i)), // 1, 2, 3...
			Path:  filepath.Join(videosDir, filename),
			Scene: "root",
		})
	}

	// 2. 扫描场景子目录
	scenes := []string{"canteen", "street", "dormitory", "building", "gate"}

	for _, scene := range scenes {
		sceneDir := filepath.Join(videosDir, scene)
		if _, err := os.Stat(sceneDir); os.IsNotExist(err) {
			continue
		}

		files, err := os.ReadDir(sceneDir)
		if err != nil {
			log.Printf("警告: 无法读取场景目录 %s: %v", scene, err)
			continue
		}

		var sceneVideos []string
		for _, f := range files {
			if !f.IsDir() && isVideoFile(f.Name()) {
				sceneVideos = append(sceneVideos, f.Name())
			}
		}

		// 按文件名排序
		sort.Strings(sceneVideos)

		// 分配场景 channel
		for i, filename := range sceneVideos {
			channels = append(channels, Channel{
				Name:  filepath.Join(scene, string(rune('1'+i))),
				Path:  filepath.Join(sceneDir, filename),
				Scene: scene,
			})
		}
	}

	return channels
}

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
	// 创建频道专属的输出目录
	outDir := filepath.Join("output", channelName)
	err := os.MkdirAll(outDir, 0755)
	if err != nil {
		log.Fatalf("无法创建输出目录 %s: %v", outDir, err)
	}

	m3u8Path := filepath.Join(outDir, "index.m3u8")
	log.Printf("开始推流频道: %s (视频: %s)", channelName, videoPath)

	// 组装 FFmpeg 命令
	cmd := exec.Command("ffmpeg",
		"-stream_loop", "-1", // 无限循环播放
		"-re",                // 以视频原生帧率读取
		"-i", videoPath,      // 输入文件
		"-c:v", "libx264",    // 强制转码为 H.264
		"-c:a", "aac",        // 强制转码音频为 AAC
		"-preset", "veryfast",
		"-f", "hls",
		"-hls_time", "4",
		"-hls_list_size", "5",
		"-hls_flags", "delete_segments",
		m3u8Path,
	)

	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		log.Printf("频道 %s 推流意外结束: %v", channelName, err)
	}
}

func main() {
	// 清理旧的切片
	os.RemoveAll("output")

	// 扫描 videos 目录，获取所有 channel
	channels := scanVideosDir()

	if len(channels) == 0 {
		log.Fatal("未找到任何视频文件，请检查 videos 目录")
	}

	// 打印 channel 映射关系
	log.Println("=== Channel 映射关系 ===")
	for _, ch := range channels {
		log.Printf("  /channel/%s -> %s", ch.Name, ch.Path)
	}
	log.Println("========================")

	// 启动所有 channel 的推流协程
	for _, ch := range channels {
		go startStream(ch.Name, ch.Path)
	}

	log.Printf("所有频道守护进程已启动，共 %d 个频道，系统运行中...", len(channels))

	// 启动静态文件服务器
	fs := http.FileServer(http.Dir("./output"))
	http.Handle("/", corsMiddleware(fs))

	// 注册 /api/channels 接口
	http.HandleFunc("/api/channels", handleChannels)

	log.Println("HTTP 服务已启动，监听端口: 8889")
	log.Println("示例播放链接: http://localhost:8889/1/index.m3u8")

	err := http.ListenAndServe(":8889", nil)
	if err != nil {
		log.Fatalf("HTTP 服务器启动失败: %v", err)
	}
}

// handleChannels 处理 /api/channels 请求
func handleChannels(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	channels := scanVideosDir()
	var channelInfos []ChannelInfo
	for _, ch := range channels {
		channelInfos = append(channelInfos, ChannelInfo{
			ID:    ch.Name,
			Name:  filepath.Base(ch.Path),
			Scene: ch.Scene,
		})
	}

	jsonBytes, err := json.Marshal(ChannelResponse{Channels: channelInfos})
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	w.Write(jsonBytes)
}