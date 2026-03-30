package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"
)

// 支持的视频文件扩展名
var videoExtensions = []string{".mp4", ".avi", ".mkv", ".mov", ".flv", ".wmv"}

func isVideoFile(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	for _, v := range videoExtensions {
		if ext == v {
			return true
		}
	}
	return false
}

func transcodeToHLS(inputPath, outputDir string) error {
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return fmt.Errorf("创建输出目录失败: %v", err)
	}

	outputPath := filepath.Join(outputDir, "index.m3u8")

	cmd := exec.Command("ffmpeg",
		"-i", inputPath,
		"-c:v", "libx264",
		"-c:a", "aac",
		"-preset", "ultrafast",
		"-b:v", "2000k",
		"-b:a", "128k",
		"-f", "hls",
		"-hls_time", "4",        // 4秒一片段，减少文件数量
		"-hls_list_size", "0",   // 0 = 不限制，保留所有切片
		"-hls_flags", "delete_segments+append_list+omit_endlist",
		outputPath,
	)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	return cmd.Run()
}

func main() {
	videosDir := "videos"
	outputDir := "output"

	// 清理旧的输出
	os.RemoveAll(outputDir)

	scenes := []string{"canteen", "street", "dormitory", "building", "gate"}

	// 1. 转码根目录视频
	rootFiles, _ := os.ReadDir(videosDir)
	var rootVideos []string
	for _, f := range rootFiles {
		if !f.IsDir() && isVideoFile(f.Name()) {
			rootVideos = append(rootVideos, f.Name())
		}
	}
	sort.Strings(rootVideos)

	channelCount := 0
	for i, filename := range rootVideos {
		inputPath := filepath.Join(videosDir, filename)
		outDir := filepath.Join(outputDir, string(rune('1'+i)))
		fmt.Printf("转码中: %s -> %s\n", filename, outDir)
		if err := transcodeToHLS(inputPath, outDir); err != nil {
			fmt.Printf("转码失败: %v\n", err)
			continue
		}
		channelCount++
	}

	// 2. 转码场景视频
	for _, scene := range scenes {
		sceneDir := filepath.Join(videosDir, scene)
		if _, err := os.Stat(sceneDir); os.IsNotExist(err) {
			continue
		}

		files, _ := os.ReadDir(sceneDir)
		var sceneVideos []string
		for _, f := range files {
			if !f.IsDir() && isVideoFile(f.Name()) {
				sceneVideos = append(sceneVideos, f.Name())
			}
		}
		sort.Strings(sceneVideos)

		for i, filename := range sceneVideos {
			inputPath := filepath.Join(sceneDir, filename)
			outDir := filepath.Join(outputDir, filepath.Join(scene, string(rune('1'+i))))
			fmt.Printf("转码中: %s -> %s\n", filename, outDir)
			if err := transcodeToHLS(inputPath, outDir); err != nil {
				fmt.Printf("转码失败: %v\n", err)
				continue
			}
			channelCount++
		}
	}

	fmt.Printf("\n转码完成! 共 %d 个频道\n", channelCount)
}