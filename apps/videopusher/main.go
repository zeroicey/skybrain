package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

type ChannelInfo struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Scene    string `json:"scene"`
	URL      string `json:"url"`      // 视频文件URL
	Duration string `json:"duration"` // 视频时长
}

type ChannelResponse struct {
	Channels []ChannelInfo `json:"channels"`
}

// scanVideosDir 扫描 videos 目录，返回所有 channel
func scanVideosDir(baseURL string) []ChannelInfo {
	var channels []ChannelInfo
	videosDir := "videos"

	if _, err := os.Stat(videosDir); os.IsNotExist(err) {
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
	sort.Strings(rootVideos)

	for i, filename := range rootVideos {
		channels = append(channels, ChannelInfo{
			ID:    string(rune('1' + i)),
			Name:  filename,
			Scene: "root",
			URL:   "/videos/" + filename,
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
			continue
		}

		var sceneVideos []string
		for _, f := range files {
			if !f.IsDir() && isVideoFile(f.Name()) {
				sceneVideos = append(sceneVideos, f.Name())
			}
		}
		sort.Strings(sceneVideos)

		for i, filename := range sceneVideos {
			channels = append(channels, ChannelInfo{
				ID:    filepath.Join(scene, string(rune('1'+i))),
				Name:  filename,
				Scene: scene,
				URL:   "/videos/" + scene + "/" + filename,
			})
		}
	}

	return channels
}

func isVideoFile(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	videoExtensions := []string{".mp4", ".avi", ".mkv", ".mov", ".flv", ".wmv", ".webm"}
	for _, v := range videoExtensions {
		if ext == v {
			return true
		}
	}
	return false
}

// CORS 中间件
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

func main() {
	port := "8889"
	if p := os.Getenv("PORT"); p != "" {
		port = p
	}

	baseURL := "http://localhost:" + port
	channels := scanVideosDir(baseURL)

	if len(channels) == 0 {
		log.Fatal("未找到任何视频文件，请检查 videos 目录")
	}

	log.Println("=== 视频频道 ===")
	for _, ch := range channels {
		log.Printf("  频道 %s: %s -> %s", ch.ID, ch.Name, ch.URL)
	}
	log.Println("================")

	// 提供 videos 目录的静态文件 - 使用绝对路径
	absPath, _ := filepath.Abs("./videos")

	// 直接用自定义 handler 来serve文件
	http.HandleFunc("/videos/", func(w http.ResponseWriter, r *http.Request) {
		// 添加 CORS 头
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Range, Content-Type")

		// 去掉 /videos/ 前缀
		relPath := strings.TrimPrefix(r.URL.Path, "/videos/")
		filePath := filepath.Join(absPath, relPath)
		http.ServeFile(w, r, filePath)
	})

	// 注册 /api/channels 接口
	http.HandleFunc("/api/channels", handleChannels(baseURL))

	log.Printf("服务已启动: http://localhost:%s", port)
	log.Printf("示例: http://localhost:%s/videos/xxx.mp4", port)

	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatalf("服务器启动失败: %v", err)
	}
}

func handleChannels(baseURL string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		channels := scanVideosDir(baseURL)

		jsonBytes, err := json.Marshal(ChannelResponse{Channels: channels})
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
		w.Write(jsonBytes)
	}
}