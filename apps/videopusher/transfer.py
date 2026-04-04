import os
import subprocess
from pathlib import Path


def batch_convert_videos_recursive(input_folder="videos", output_folder="videos_h264"):
    in_dir = Path(input_folder)
    out_dir = Path(output_folder)

    if not in_dir.exists():
        print(f"❌ 找不到输入文件夹: '{input_folder}'，请确保该文件夹与脚本在同一目录下。")
        return

    video_extensions = {'.mp4', '.avi', '.mov', '.mkv', '.flv'}

    # 使用 rglob('*') 递归查找所有的文件
    video_files = []
    for file_path in in_dir.rglob('*'):
        if file_path.is_file() and file_path.suffix.lower() in video_extensions:
            video_files.append(file_path)

    if not video_files:
        print(f"⚠️ 在 '{input_folder}' 及其子文件夹中没有找到视频文件。")
        return

    print(f"🔍 扫荡完毕！共找到 {len(video_files)} 个视频文件，准备开始转码...\n")

    for index, file_path in enumerate(video_files, 1):
        # 计算相对路径，比如子文件夹里的 "canteen/Video Project 9.mp4"
        rel_path = file_path.relative_to(in_dir)
        
        # 构造最终输出路径，并重命名为 _web.mp4
        out_path = out_dir / rel_path.with_name(f"{file_path.stem}_web.mp4")

        # 核心：如果这个视频在子文件夹里，自动在输出目录创建对应的子文件夹
        out_path.parent.mkdir(parents=True, exist_ok=True)

        print(f"[{index}/{len(video_files)}] 🎬 正在处理: {rel_path}")

        command = [
            "ffmpeg",
            "-i", str(file_path),
            "-c:v", "libx264",
            "-c:a", "aac",
            "-y",  # 直接覆盖已存在的文件
            str(out_path)
        ]

        try:
            # 同样把乱七八糟的输出隐藏，保持清爽
            subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            # 打印相对路径，方便你看到它存到哪个子文件夹里了
            print(f"  ✅ 成功 -> 保存至: {out_path.relative_to(out_dir)}\n")
        except subprocess.CalledProcessError:
            print(f"  ❌ 失败: 转换 {rel_path} 时发生错误。\n")

    print(f"🎉 全部处理完成！转码后的视频都在 '{output_folder}' 文件夹里，并且完美保留了原来的子文件夹结构！")

if __name__ == "__main__":
    # 执行函数
    batch_convert_videos_recursive(input_folder="videos", output_folder="videos_h264")
