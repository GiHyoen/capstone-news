from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List, Optional
from transformers import BartForConditionalGeneration, PreTrainedTokenizerFast
import torch
import re

app = FastAPI()

# ✅ 모델 로드 (GPU 우선)
MODEL_NAME = "gogamza/kobart-summarization"
tokenizer = PreTrainedTokenizerFast.from_pretrained(MODEL_NAME)
model = BartForConditionalGeneration.from_pretrained(MODEL_NAME)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()  # 추론 모드 전환

# ✅ 데이터 모델
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

# ✅ HTML 제거
def clean_html(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"&[a-z]+;", "", text)
    text = re.sub(r"[<>]+", "", text)
    text = text.replace("‘", "").replace("’", "")
    return text.strip()

# ✅ 입력 포맷
def prepare_input(title: str, description: str) -> str:
    title = clean_html(title)
    description = clean_html(description)
    return description if title in description else f"{title} {description}"

# ✅ 요약 정제
def clean_summary(text: str) -> str:
    text = text.strip().replace("\n", " ")
    text = re.sub(r"&[a-z]+;", "", text)
    text = re.sub(r"(.)\1{3,}", r"\1", text)
    text = re.sub(r"(\b\w+\b)( \1\b)+", r"\1", text)
    sentences = re.split(r"(?<=[.!?])\s+", text)
    seen = set()
    cleaned = []
    for s in sentences:
        s = s.strip()
        if s and s not in seen and len(s) > 5:
            seen.add(s)
            cleaned.append(s)
    return " ".join(cleaned[:3])

# ✅ 요약 엔드포인트
@app.post("/api/summarize")
async def summarize_articles(request: Request):
    try:
        body = await request.json()
        request_data = SummaryRequest(**body)
    except Exception as e:
        return {"error": str(e)}

    # ✅ 텍스트 구성
    input_texts = [
        prepare_input(article.title, article.description)
        for article in request_data.articles
    ]

    # ✅ 배치 토크나이즈
    inputs = tokenizer(
        input_texts,
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=512
    ).to(device)

    # ✅ 모델 요약 (배치로 처리)
    with torch.no_grad():
        summary_ids = model.generate(
            inputs["input_ids"],
            max_length=80,
            min_length=20,
            num_beams=2,
            no_repeat_ngram_size=3,
            repetition_penalty=2.5,
            length_penalty=1.0,
            early_stopping=True
        )

    # ✅ 디코딩 및 정제
    summaries = [
        clean_summary(tokenizer.decode(g, skip_special_tokens=True))
        for g in summary_ids
    ]

    # ✅ 결합 결과 반환
    summarized = []
    for article, summary in zip(request_data.articles, summaries):
        summarized.append({
            "title": article.title,
            "summary": summary,
            "link": article.link,
            "date": article.pDate,
            "image": article.image
        })

    return {"results": summarized}