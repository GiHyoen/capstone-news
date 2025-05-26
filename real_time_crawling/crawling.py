import os
import sys
import urllib.request
import datetime
import json
import urllib.parse
import re
import platform

# 네이버 API 인증 정보
client_id = 'aFzMN5Aq9I_yZU53XgP6'
client_secret = '_VozDZysXY'

# OS에 따라 저장 경로 설정
if platform.system() == "Windows":
    SAVE_DIR = "C:\\Users\\cptai\\Downloads\\news_crawling\\"
else:
    SAVE_DIR = "/Users/gihyeon/Documents/github/news_crawling/"

def getRequestUrl(url):
    req = urllib.request.Request(url)
    req.add_header("X-Naver-Client-Id", client_id)
    req.add_header("X-Naver-Client-Secret", client_secret)
    try:
        response = urllib.request.urlopen(req)
        if response.getcode() == 200:
            print(f"[{datetime.datetime.now()}] URL 요청 성공")
            return response.read().decode("utf-8")
    except Exception as e:
        print(f"URL 요청 에러: {e}")
    return None

def getNaverSearch(node, srcText, start, display):
    base = "https://openapi.naver.com/v1/search"
    node_path = f"/{node}.json"
    parameters = f"?query={urllib.parse.quote(srcText)}&start={start}&display={display}"
    result = getRequestUrl(base + node_path + parameters)
    return json.loads(result) if result else None

def getPostData(post, jsonResult, cnt):
    try:
        pDate = datetime.datetime.strptime(post['pubDate'], '%a, %d %b %Y %H:%M:%S +0900')
    except ValueError:
        pDate = datetime.datetime.now()
    jsonResult.append({
        'cnt': cnt,
        'title': post.get('title', ''),
        'description': post.get('description', ''),
        'org_link': post.get('originallink', ''),
        'link': post.get('link', ''),
        'pDate': pDate.strftime('%Y-%m-%d %H:%M:%S')
    })

def main():
    if len(sys.argv) < 2:
        print("검색어 인자가 없습니다.")
        return

    srcText = sys.argv[1]
    safe_text = re.sub(r'[^\w\s가-힣-]', '', srcText).strip()
    if not safe_text:
        print("유효하지 않은 검색어입니다.")
        return

    jsonResult, cnt = [], 0
    MAX_COUNT = 50
    start = 1

    while True:
        jsonResponse = getNaverSearch('news', srcText, start, 100)
        if not jsonResponse or 'items' not in jsonResponse or not jsonResponse['items']:
            break

        for post in jsonResponse['items']:
            cnt += 1
            getPostData(post, jsonResult, cnt)
            if cnt >= MAX_COUNT:
                break

        if cnt >= MAX_COUNT or jsonResponse.get('display', 0) == 0:
            break

        start += jsonResponse.get('display', 0)

    os.makedirs(SAVE_DIR, exist_ok=True)
    file_path = os.path.join(SAVE_DIR, f"{safe_text}_naver_news.json")
    with open(file_path, 'w', encoding='utf8') as f:
        json.dump(jsonResult, f, indent=4, ensure_ascii=False)

    print(f"\n{cnt}건 수집 완료 → {file_path}")

if __name__ == '__main__':
    main()
