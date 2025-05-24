import sys
import os
import json
import re
import platform
from transformers import BartForConditionalGeneration, PreTrainedTokenizerFast

# OS에 따라 저장 디렉토리 경로 설정
if platform.system() == "Windows":
    SAVE_DIR = "C:\\Users\\cptai\\Downloads\\news_crawling\\"
else:
    SAVE_DIR = "/Users/gihyeon/Downloads/news_crawling/"

MODEL_NAME = "gogamza/kobart-summarization"

def load_articles(file_path):
    with open(file_path, 'r', encoding='utf8') as f:
        return json.load(f)

def save_articles(file_path, articles):
    with open(file_path, 'w', encoding='utf8') as f:
        json.dump(articles, f, ensure_ascii=False, indent=4)

def summarize_text(text, model, tokenizer):
    input_ids = tokenizer.encode(text, return_tensors="pt", max_length=512, truncation=True)
    summary_ids = model.generate(input_ids, max_length=100, min_length=20, length_penalty=2.0, num_beams=4, early_stopping=True)
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

def main():
    if len(sys.argv) < 2:
        print("검색어가 없습니다.")
        return

    query = sys.argv[1]
    safe_query = re.sub(r"[^\w\s가-힣-]", "", query).strip()
    file_path = os.path.join(SAVE_DIR, f"{safe_query}_naver_news.json")

    if not os.path.exists(file_path):
        print("JSON 파일이 존재하지 않습니다:", file_path)
        return

    print("모델 로딩 중...")
    tokenizer = PreTrainedTokenizerFast.from_pretrained(MODEL_NAME)
    model = BartForConditionalGeneration.from_pretrained(MODEL_NAME)

    articles = load_articles(file_path)

    for article in articles:
        text = re.sub('<[^>]+>', '', article.get("description", ""))
        try:
            summary = summarize_text(text, model, tokenizer)
            article["summary"] = summary
            print("요약 완료:", summary)
        except Exception as e:
            print("요약 실패:", e)
            article["summary"] = "(요약 실패)"

    save_articles(file_path, articles)
    print("요약 결과 저장 완료:", file_path)

if __name__ == "__main__":
    main()
