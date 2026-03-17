#!/usr/bin/env python3
"""
720yun VR 页面代理服务
后端请求目标网站，去除不需要的标签后返回给前端
"""
import os
import requests
from flask import Flask, jsonify, Response
from flask_cors import CORS
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

# 要去除的标签列表
TAGS_TO_REMOVE = [
    'script', 'style', 'iframe', 'noscript', 'object', 'embed', 'link', 'form'
]

# 要去除的属性列表
ATTRIBUTES_TO_REMOVE = [attr for attr in dir() if attr.startswith('on')]

TARGET_URL = "https://www.720yun.com/vr/c9b26askyyw"

# 缓存外部资源
resource_cache = {}


def fetch_external_resource(url: str) -> str:
    """获取外部资源并缓存"""
    if url in resource_cache:
        return resource_cache[url]

    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
        response = requests.get(url, headers=headers, timeout=10)
        content = response.text
        resource_cache[url] = content
        return content
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
        return ""


def inline_external_scripts(html_content: str) -> str:
    """把外部脚本内联到HTML中"""
    soup = BeautifulSoup(html_content, 'html.parser')

    # 处理外部 script
    for script in soup.find_all('script', src=True):
        src = script.get('src')
        if src.startswith('http://') or src.startswith('https://'):
            content = fetch_external_resource(src)
            # 创建新的内联 script
            new_script = soup.new_tag('script')
            new_script.string = content
            # 复制其他属性
            for attr in ['type', 'id', 'class']:
                if script.has_attr(attr):
                    new_script[attr] = script[attr]
            script.replace_with(new_script)

    return str(soup)


def clean_html(html_content: str) -> str:
    """清洗HTML，去除不需要的标签和属性，并内联外部脚本"""
    soup = BeautifulSoup(html_content, 'html.parser')

    # 去除指定标签（保留 script 因为需要处理外部脚本）
    tags_to_remove = ['style', 'iframe', 'noscript', 'object', 'embed', 'link', 'form']
    for tag in tags_to_remove:
        for element in soup.find_all(tag):
            element.decompose()

    # 去除所有事件属性
    for element in soup.find_all(True):
        attrs_to_delete = [attr for attr in element.attrs if attr.startswith('on')]
        for attr in attrs_to_delete:
            del element[attr]

    result = str(soup)

    # 内联外部脚本
    result = inline_external_scripts(result)

    return result


@app.route('/api/proxy-vr', methods=['GET'])
def proxy_vr():
    """代理接口：获取VR页面并清洗后返回HTML"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        }

        response = requests.get(TARGET_URL, headers=headers, timeout=30)
        response.raise_for_status()

        cleaned_html = clean_html(response.text)

        return Response(cleaned_html, content_type='text/html; charset=utf-8')

    except requests.exceptions.RequestException as e:
        return f"Error: {str(e)}", 500


@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({'status': 'ok', 'service': '720yun VR Proxy'})


@app.route('/api/proxy-vr-raw', methods=['GET'])
def proxy_vr_raw():
    """原始代理接口：不进行任何清洗，直接返回HTML"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        }

        response = requests.get(TARGET_URL, headers=headers, timeout=30)
        response.raise_for_status()

        return Response(response.text, content_type='text/html; charset=utf-8')

    except requests.exceptions.RequestException as e:
        return f"Error: {str(e)}", 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)