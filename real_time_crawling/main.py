from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List, Optional
from transformers import BartForConditionalGeneration, PreTrainedTokenizerFast
import re

app = FastAPI()

# ✅ 모델 로드
MODEL_NAME = "gogamza/kobart-summarization"
tokenizer = PreTrainedTokenizerFast.from_pretrained(MODEL_NAME)
model = BartForConditionalGeneration.from_pretrained(MODEL_NAME)

# ✅ 모델 입력 타입 정의
class Article(BaseModel):
    cnt: int
    title: str
    description: str
    org_link: str
    link: str
    pDate: str
    image: Optional[str] = None

class SummaryRequest(BaseModel):
    articles: List[Article]

# ✅ HTML/특수문자 정제 함수
def clean_html(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text)  # 태그 제거
    text = re.sub(r"&[a-z]+;", "", text)  # HTML 엔티티 제거
    text = re.sub(r"[<>]+", "", text)     # 특수 괄호 제거
    text = text.replace("‘", "").replace("’", "")
    return text.strip()

# ✅ 입력 텍스트 구성 (중복 제목 제거 포함)
def prepare_input(title: str, description: str) -> str:
    title = clean_html(title)
    description = clean_html(description)
    if title in description:
        return description
    else:
        return f"{title} {description}"

# ✅ 요약 후처리 함수 (중복 문장/단어 제거, 앞부분만 유지)
def clean_summary(text: str) -> str:
    text = text.strip().replace("\n", " ")
    text = re.sub(r"&[a-z]+;", "", text)  # HTML entity 제거
    text = re.sub(r"(.)\1{3,}", r"\1", text)  # 글자 반복 제거
    text = re.sub(r"(\b\w+\b)( \1\b)+", r"\1", text)  # 단어 반복 제거

    sentences = re.split(r"(?<=[.!?])\s+", text)
    seen = set()
    cleaned = []
    for s in sentences:
        s = s.strip()
        if s and s not in seen and len(s) > 5:
            seen.add(s)
            cleaned.append(s)
    return " ".join(cleaned[:3])

# ✅ FastAPI 요약 엔드포인트
@app.post("/api/summarize")
async def summarize_articles(request: Request):
    try:
        body = await request.json()
        request_data = SummaryRequest(**body)
    except Exception as e:
        return {"error": str(e)}

    summarized = []

    for article in request_data.articles:
        input_text = prepare_input(article.title, article.description)
        input_ids = tokenizer.encode(
            input_text,
            return_tensors="pt",
            max_length=512,
            truncation=True
        )

        summary_ids = model.generate(
            input_ids,
            max_length=100,
            min_length=20,
            num_beams=4,
            no_repeat_ngram_size=3,     # 🔑 반복 방지 핵심
            repetition_penalty=2.5,
            length_penalty=1.0,
            early_stopping=True
        )

        raw_summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        final_summary = clean_summary(raw_summary)

        summarized.append({
            "title": article.title,
            "summary": final_summary,
            "link": article.link,
            "date": article.pDate,
            "image": article.image
        })

    return {"results": summarized}