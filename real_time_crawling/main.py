from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ✅ CORS 임포트
from pydantic import BaseModel
from transformers import BartForConditionalGeneration, PreTrainedTokenizerFast

app = FastAPI()

# ✅ CORS 설정을 여기 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 중에는 * 사용, 배포 시에는 특정 도메인 지정 권장
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 모델 로딩
MODEL_NAME = "gogamza/kobart-summarization"
tokenizer = PreTrainedTokenizerFast.from_pretrained(MODEL_NAME)
model = BartForConditionalGeneration.from_pretrained(MODEL_NAME)

# ✅ 요청 본문 스키마 정의
class SummaryRequest(BaseModel):
    text: str

# ✅ POST 방식 요약 엔드포인트
@app.post("/api/summarize")
def summarize(req: SummaryRequest):
    input_ids = tokenizer.encode(req.text, return_tensors="pt", max_length=512, truncation=True)
    summary_ids = model.generate(
        input_ids, max_length=100, min_length=20,
        length_penalty=2.0, num_beams=4, early_stopping=True
    )
    result = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return {"summary": result}