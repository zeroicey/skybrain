#!/usr/bin/env python3
"""
720yun VR 页面代理服务
后端请求目标网站，去除不需要的标签后返回给前端
"""
import re
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

# 要去除的标签列表
TAGS_TO_REMOVE = [
    'script',      # JavaScript
    'style',       # CSS样式
    'iframe',      # 内嵌框架
    'noscript',    # 无脚本内容
    'object',      # 对象
    'embed',       # 嵌入内容
    'link',        # 外部链接(可选)
    'form',        # 表单(可选)
]

# 要去除的属性列表
ATTRIBUTES_TO_REMOVE = [
    'onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout',  # 事件属性
    'onfocus', 'onblur', 'onsubmit', 'onchange',
]

TARGET_URL = "https://www.720yun.com/vr/c9b26askyyw"


def clean_html(html_content: str) -> str:
    """清洗HTML，去除不需要的标签和属性"""
    soup = BeautifulSoup(html_content, 'html.parser')

    # 去除指定标签
    for tag in TAGS_TO_REMOVE:
        for element in soup.find_all(tag):
            element.decompose()

    # 去除危险属性
    for element in soup.find_all(True):  # 查找所有标签
        for attr in ATTRIBUTES_TO_REMOVE:
            if element.has_attr(attr):
                del element[attr]

    # 可选：移除所有 onclick, onload 等事件处理器
    for element in soup.find_all(True):
        attrs_to_delete = [attr for attr in element.attrs if attr.startswith('on')]
        for attr in attrs_to_delete:
            del element[attr]

    return str(soup)


@app.route('/api/proxy-vr', methods=['GET'])
def proxy_vr():
    """代理接口：获取VR页面并清洗后返回"""
    try:
        # 设置请求头，模拟浏览器访问
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        }

        response = requests.get(TARGET_URL, headers=headers, timeout=30)
        response.raise_for_status()

        # 清洗HTML
        cleaned_html = clean_html(response.text)

        return jsonify({
            'success': True,
            'url': TARGET_URL,
            'html': cleaned_html,
            'original_length': len(response.text),
            'cleaned_length': len(cleaned_html),
        })

    except requests.exceptions.RequestException as e:
        return jsonify({
            'success': False,
            'error': str(e),
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Unexpected error: {str(e)}',
        }), 500


@app.route('/api/status', methods=['GET'])
def status():
    """健康检查接口"""
    return jsonify({
        'status': 'ok',
        'service': '720yun VR Proxy',
    })


if __name__ == '__main__':
    print(f"启动 VR 代理服务...")
    print(f"目标URL: {TARGET_URL}")
    print(f"将去除以下标签: {TAGS_TO_REMOVE}")
    app.run(host='0.0.0.0', port=5000, debug=True)