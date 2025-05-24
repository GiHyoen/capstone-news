// src/pages/MainPage.tsx
import React, { useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { FaStar, FaBookBookmark } from "react-icons/fa6";
import Header from "../components/Header";

interface NewsCardProps {
  title: string;
  summary: string;
  image: string;
}

const CategoryBar: React.FC = () => (
  <div style={styles.categoryBarWrapper}>
    <div style={styles.categoryBar}>
      {["종합", "IT/과학", "건강", "과학", "스포츠", "연예"].map((cat, idx) => (
        <span key={idx}>{cat}</span>
      ))}
    </div>
  </div>
);

const IconButtons: React.FC = () => {
  const [starred, setStarred] = useState(false);
  return (
    <div style={styles.iconButtons}>
      <button onClick={() => setStarred(!starred)} title="즐겨찾기" style={styles.iconButton}>
        <FaStar color={starred ? "#FFD700" : "#ccc"} size={20} />
      </button>
      <button title="책 아이콘" style={styles.iconButton}>
        <FaBookBookmark color="#555" size={20} />
      </button>
    </div>
  );
};

const NewsCard: React.FC<NewsCardProps> = ({ title, summary, image }) => (
  <div style={styles.newsCard}>
    <div style={styles.thumbnailWrapper}>
      <img src={image} alt="thumbnail" style={styles.thumbnail} />
      <IconButtons />
    </div>
    <div style={styles.newsTitle}>{title}</div>
    <p style={styles.newsSummary}>{summary}</p>
  </div>
);

const RightPanel: React.FC = () => {
  const [addedList, setAddedList] = useState<boolean[]>([false, false, false, false, false]);
  const toggleAdded = (index: number) => {
    const newList = [...addedList];
    newList[index] = !newList[index];
    setAddedList(newList);
  };
  const recommendations = ["기사 추천 1", "기사 추천 2", "기사 추천 3", "기사 추천 4", "기사 추천 5"];

  return (
    <div style={styles.rightPanel}>
      <h2 style={styles.rightTitle}>이런 기사 어때요?</h2>
      <ul style={styles.rightList}>
        {recommendations.map((text, index) => (
          <li key={index} style={styles.rightItem}>
            <span>{text}</span>
            <button onClick={() => toggleAdded(index)} title="보관함 추가" style={styles.iconButton}>
              <CiSquarePlus color={addedList[index] ? "#8b5cf6" : "#666"} size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const MainPage: React.FC = () => {
  return (
    <div style={styles.app}>
      <Header />

      <CategoryBar />
      <main style={styles.main}>
        <div style={styles.column}>
          <h2 style={styles.topStories}>Top Stories</h2>
          <NewsCard title="30대 가장 싱크홀 비극…주7일 일 배달 부업 뛰다 참변" summary="서울 강남구 역삼동 싱크홀 사고로 사망한 모모씨의 흔적이 전해지며 안타까움을 사고 있다." image="/images/sinkhole.png" />
          <NewsCard title="산불 의심돼 헬기 출동, 조종사 숨져…군작전 헬기긴급 출동 중" summary="당시엔 비행허가가 없던 상황이었으며 국방부에 따르면 임무가 완료되지 않은 상태였다." image="/images/helicopter.png" />
        </div>
        <div style={styles.column}>
          <NewsCard title="은하 중심에서 몰려오는 우주 토네이도 [우주로 간다]" summary="천문학자들이 밝혀낸 은하 중심의 토네이도 현상과 그로 인한 우주폭풍 효과를 다룬 과학 기사." image="/images/galaxy.png" />
          <NewsCard title="이해진 창업한 네이버, 김범수 떠난 카카오…주홍서도 'AI'" summary="네이버와 카카오의 AI 기술 경쟁과 관련된 분석 기사로, 두 회사의 기술력과 전략이 비교됨." image="/images/naver-kakao.png" />
        </div>
        <div style={styles.column}>
          <RightPanel />
        </div>
      </main>
    </div>
  );
};

const styles = {
  app: { fontFamily: 'Segoe UI, sans-serif' },
  categoryBarWrapper: {
    position: 'fixed' as const,
    top: '50px',
    left: 0,
    width: '100%',
    backgroundColor: 'white',
    zIndex: 90,
    borderBottom: '1px solid #ccc',
  },
  categoryBar: {
    padding: '8px 24px', display: 'flex', gap: '16px', fontSize: '14px'
  },
  main: {
    display: 'grid', gridTemplateColumns: '3fr 5fr 2fr', gap: '24px', padding: '24px',
    marginTop: '120px'
  },
  column: { display: 'flex', flexDirection: 'column' as const, gap: '16px' },
  topStories: { fontWeight: 'bold', fontSize: '18px' },
  newsCard: {
    backgroundColor: 'white', borderRadius: '16px', padding: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
  },
  thumbnailWrapper: { position: 'relative' as const },
  thumbnail: {
    width: '100%', aspectRatio: '5/3', objectFit: 'cover' as const, borderRadius: '8px'
  },
  iconButtons: { position: 'absolute' as const, top: '8px', right: '8px', display: 'flex', gap: '6px' },
  iconButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
  newsTitle: { marginTop: '8px', fontWeight: 600, fontSize: '14px' },
  newsSummary: { fontSize: '12px', color: '#555', marginTop: '4px' },
  rightPanel: {
    backgroundColor: 'white', borderRadius: '16px', padding: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
  },
  rightTitle: { fontWeight: 'bold', marginBottom: '12px', fontSize: '16px' },
  rightList: { listStyle: 'none', padding: 0, fontSize: '13px' },
  rightItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },

  logoutButton: {
    backgroundColor: '#FEE500', color: '#000', border: 'none',
    padding: '8px 12px', borderRadius: '8px', fontWeight: 600,
    cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
} as const;

export default MainPage;
