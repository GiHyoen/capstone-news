from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel, Field
from typing import List
from transformers import BartForConditionalGeneration, PreTrainedTokenizerFast
import re
import json

app = FastAPI()

MODEL_NAME = "gogamza/kobart-summarization"
tokenizer = PreTrainedTokenizerFast.from_pretrained(MODEL_NAME)
model = BartForConditionalGeneration.from_pretrained(MODEL_NAME)

class Article(BaseModel):
    cnt: int
    title: str
    description: str
    org_link: str
    link: str
    pDate: str

class SummaryRequest(BaseModel):
    articles: List[Article]

@app.post("/api/summarize")
async def summarize_articles(request: Request):
    try:
        print("📌 요청 헤더:", dict(request.headers))
        body = await request.json()
        request_data = SummaryRequest(**body)  # 수동 파싱 (오류 유발 시 정확한 지점 확인 가능)
    except Exception as e:
        print("❌ 파싱 실패:", e)
        return {"error": str(e)}

    summarized = []
    for article in request_data.articles:
        clean_text = re.sub(r"<[^>]+>", "", article.description)
        input_ids = tokenizer.encode(clean_text, return_tensors="pt", max_length=512, truncation=True)
        summary_ids = model.generate(input_ids, max_length=100, min_length=20, num_beams=4, length_penalty=2.0, early_stopping=True)
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

        summarized.append({
            "title": article.title,
            "summary": summary,
            "link": article.link,
            "date": article.pDate
        })

    return {"results": summarized}