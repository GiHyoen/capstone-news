import os
import urllib.request
import datetime
import json
import urllib.parse

client_id = 'aFzMN5Aq9I_yZU53XgP6'
client_secret = '_VozDZysXY'

# ✅ 저장할 절대 경로 설정
SAVE_DIR = "/Users/gihyeon/Documents/github/capstone-news"

def getRequestUrl(url):
    req = urllib.request.Request(url)
    req.add_header("X-Naver-Client-Id", client_id)
    req.add_header("X-Naver-Client-Secret", client_secret)

    try:
        response = urllib.request.urlopen(req)
        if response.getcode() == 200:
            print("[%s] ✅ URL 요청 성공" % datetime.datetime.now())
            return response.read().decode('utf-8')
    except Exception as e:
        print("❌", e)
        print("[%s] ❌ URL 요청 에러 : %s" % (datetime.datetime.now(), url))
        return None

def getNaverSearch(node, srcText, start, display):
    base = "https://openapi.naver.com/v1/search"
    node = "/%s.json" % node
    parameters = "?query=%s&start=%s&display=%s" % (
        urllib.parse.quote(srcText), start, display)

    url = base + node + parameters
    return json.loads(getRequestUrl(url)) if getRequestUrl(url) else None

def getPostData(post, jsonResult, cnt):
    title = post['title']
    description = post['description']
    org_link = post['originallink']
    link = post['link']
    pDate = datetime.datetime.strptime(post['pubDate'], '%a, %d %b %Y %H:%M:%S +0900')
    pDate = pDate.strftime('%Y-%m-%d %H:%M:%S')
    jsonResult.append({
        'cnt': cnt,
        'title': title,
        'description': description,
        'org_link': org_link,
        'link': org_link,
        'pDate': pDate
    })

def main():
    node = 'news'
    srcText = input("검색어를 입력하세요: ").strip()
    cnt = 0
    jsonResult = []
    MAX_COUNT = 50  # ✅ 최대 수집 개수

    jsonResponse = getNaverSearch(node, srcText, 1, 100)
    if jsonResponse is None:
        print("❌ 검색 결과 없음")
        return

    total = jsonResponse.get('total', 0)

    while (jsonResponse and jsonResponse.get('display') != 0):
        for post in jsonResponse['items']:
            cnt += 1
            getPostData(post, jsonResult, cnt)
            if cnt >= MAX_COUNT:  # ✅ 50개까지만 수집
                break

        if cnt >= MAX_COUNT:
            break

        start = jsonResponse['start'] + jsonResponse['display']
        jsonResponse = getNaverSearch(node, srcText, start, 100)

    if not os.path.exists(SAVE_DIR):
        os.makedirs(SAVE_DIR)

    filename = f"{srcText}_naver_news.json"
    full_path = os.path.join(SAVE_DIR, filename)

    with open(full_path, 'w', encoding='utf8') as outfile:
        json.dump(jsonResult, outfile, indent=4, ensure_ascii=False)

    print(f"\n🐍 PYTHON: {cnt}건의 데이터를 수집하였습니다.")
    print(f"🐍 PYTHON: {full_path} 저장 완료")

if __name__ == '__main__':
    main()