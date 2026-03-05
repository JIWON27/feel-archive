'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { EMOTION_EMOJI, EMOTION_TAG_STYLE, EMOTION_LABEL } from '@/types/emotion';
import styles from './page.module.css';

const FAQS = [
  {
    q: '무료로 사용할 수 있나요?',
    a: '네, Feel-Archive의 핵심 기능인 지도 기록과 타임캡슐은 모두 무료로 제공됩니다. 부담 없이 시작해보세요.',
  },
  {
    q: '내 기록은 안전한가요?',
    a: '네. 아카이브를 작성할 때 공개/비공개를 직접 선택할 수 있습니다. 나만 보고 싶은 기록은 비공개로, 다른 사람과 나누고 싶은 경험은 공개로 설정해보세요.',
  },
  {
    q: '타임캡슐은 수정 가능한가요?',
    a: '타임캡슐로 봉인된 기록은 등록 후 30분 이내에만 수정이 가능합니다. 이후에는 설정한 날짜까지 수정하거나 열어볼 수 없습니다. 온전히 미래의 나에게 맡겨주세요.',
  },
  {
    q: '모바일 앱도 있나요?',
    a: '현재는 웹 버전으로 제공되며, 모바일 브라우저에서도 완벽하게 호환됩니다. 전용 앱은 추후 출시 예정입니다.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // 로그인된 사용자는 홈으로
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router]);

  // 스크롤 효과
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setScrollProgress(height > 0 ? (winScroll / height) * 100 : 0);
      setIsHeaderScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={styles.page}>
      {/* 스크롤 진행도 */}
      <div className={styles.scrollProgress} style={{ width: `${scrollProgress}%` }} />

      {/* ── HEADER ── */}
      <header className={`${styles.header} ${isHeaderScrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.navContainer}>
          <a href="#" className={styles.logo}>
            Feel<span>-Archive</span>
          </a>
          <nav className={styles.navLinks}>
            <a onClick={() => scrollTo('map')} style={{ cursor: 'pointer' }}>기능소개</a>
            <a onClick={() => scrollTo('community')} style={{ cursor: 'pointer' }}>아카이브</a>
            <a onClick={() => scrollTo('faq')} style={{ cursor: 'pointer' }}>Q&A</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/login" className={styles.btnLogin}>로그인</Link>
            <Link href="/signup" className={styles.btnStart}>회원가입</Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className={styles.heroMapUi}>
        <div className={styles.vectorMapBg}>
          <div className={styles.mapGrid} />
          <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
            <path className={styles.parkArea} d="M1200,600 Q1400,500 1600,700 T1800,800 L1800,1080 L1200,1080 Z" />
            <path className={styles.parkArea} d="M100,100 Q300,50 400,300 T200,500 L0,500 L0,100 Z" />
            <path className={styles.riverPath} d="M-50,800 C400,750 600,900 1000,850 S1600,600 2000,650" />
            <path className={styles.roadMain} d="M0,300 L1920,300" />
            <path className={styles.roadMain} d="M0,500 L1920,500" />
            <path className={styles.roadMain} d="M500,0 L500,1080" />
            <path className={styles.roadMain} d="M1300,0 L1300,1080" />
            <path className={styles.roadMain} d="M0,0 L800,1080" />
          </svg>
        </div>

        <div className={styles.uiLayer}>
          <div className={styles.mapSearchBar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D19D5E" strokeWidth="3">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span style={{ color: '#888', fontSize: '0.9rem' }}>내 주변 &lsquo;우울 해소&rsquo; 경험 검색...</span>
          </div>
          <div className={styles.mapControls}>
            <div className={styles.controlBtn} title="내 위치">📍</div>
            <div className={styles.controlBtn} title="필터">⚡</div>
          </div>

          <div className={`${styles.marker} ${styles.markerActive}`} style={{ top: '45%', left: '52%' }}>
            <span style={{ fontSize: '1.2rem' }}>🌿</span> 김민수 (나)
          </div>
          <div className={`${styles.marker} ${styles.markerScraped}`} style={{ top: '30%', left: '28%', animationDelay: '1s' }}>
            <span style={{ fontSize: '1.2rem' }}>😭</span> 슬픔
          </div>
          <div className={`${styles.marker} ${styles.markerCalm}`} style={{ top: '20%', right: '15%', animationDelay: '1.5s' }}>
            <span style={{ fontSize: '1.2rem' }}>😊</span> 기쁨
          </div>
          <div className={styles.marker} style={{ top: '70%', left: '75%', animationDelay: '1.5s' }}>
            <span style={{ fontSize: '1.2rem' }}>😮‍💨</span> 지침
          </div>

          <div className={styles.recordCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #B4E4FF, #95BDFF)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🐱</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>김민수</div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>망원동 · 2시간 전</div>
              </div>
            </div>
            <div style={{ fontSize: '0.95rem', color: '#444' }}>
              &ldquo;생각이 많을 때 물결 멍 때리기가 생각보다 효과가 좋네요. 복잡한 생각이 정리됩니다.&rdquo;
            </div>
          </div>
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroH1}>
            내 감정을 <span className={styles.highlight}>기록</span>하고,<br />
            누군가의 위로를 발견하세요
          </h1>
          <p className={styles.heroP}>
            지친 날, 주변 누군가도 같은 감정을 견뎌냈어요.
          </p>
          <div className={styles.heroActions}>
            <Link href="/signup" className={styles.btnHeroPrimary}>무료로 시작하기</Link>
            <Link href="/login" className={styles.btnHeroSecondary}>이미 계정이 있어요</Link>
          </div>
        </div>
      </section>

      {/* ── FEATURE: 지도 & 탐색 ── */}
      <section className={styles.section} id="map">
        <div className={styles.container}>
          <div className={styles.featureSplit}>
            <div className={styles.featureText}>
              <span className={styles.featureTag}>지도 & 탐색 (Explore)</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '24px', lineHeight: 1.3 }}>
                내 주변 사람들은<br />어디서 위로받았을까요?
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '32px' }}>
                현재 위치를 기반으로 주변의 감정 기록들을 지도 위에서 발견하세요.<br />
                누군가의 솔직한 경험이 나의 다음 장소가 될 수 있습니다.
              </p>
              <ul className={styles.checkList}>
                <li><strong>위치 기반 자동 탐색:</strong> 내 주변 반경 내 공개 아카이브를 자동으로 불러옵니다.</li>
                <li><strong>지도-리스트 연동:</strong> 리스트에서 선택하면 지도가 이동하고, 마커를 클릭하면 미리보기를 확인.</li>
                <li><strong>피드에서 더 깊게:</strong> 감정 필터링, 키워드 검색, 인기순 정렬은 피드 페이지에서 가능.</li>
              </ul>
            </div>
            <div className={styles.featureVisual} style={{ background: '#F9FAFB' }}>
              <div style={{ background: 'white', padding: '20px', width: '300px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '12px', fontWeight: 600 }}>📍 내 주변 아카이브</div>
                <div style={{ height: '1px', background: '#eee', marginBottom: '12px' }} />
                {[
                  { gradient: 'linear-gradient(135deg, #A8E6CF, #56AB91)', emoji: '😌', tag: { bg: '#E3FDF3', text: '#047857' }, label: '차분한', w1: '55%', w2: '40%', loc: '서울숲' },
                  { gradient: 'linear-gradient(135deg, #B4B4DC, #8484C6)', emoji: '😢', tag: { bg: '#F0F9FF', text: '#0369A1' }, label: '슬픈',   w1: '70%', w2: '50%', loc: '연남동' },
                  { gradient: 'linear-gradient(135deg, #FFE5B4, #FFB347)', emoji: '😊', tag: { bg: '#FFF8E1', text: '#B45309' }, label: '행복한', w1: '60%', w2: '45%', loc: '한강공원' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid #f5f5f5' : 'none' }}>
                    <div style={{ width: '36px', height: '36px', background: item.gradient, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{item.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: item.tag.bg, color: item.tag.text }}>{item.label}</span>
                        <span style={{ fontSize: '0.7rem', color: '#aaa' }}>📍 {item.loc}</span>
                      </div>
                      <div style={{ height: '8px', width: item.w1, background: '#f0f0f0', borderRadius: '4px', marginBottom: '3px' }} />
                      <div style={{ height: '8px', width: item.w2, background: '#f0f0f0', borderRadius: '4px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE: 타임캡슐 ── */}
      <section className={`${styles.section} ${styles.sectionGray}`} id="timecapsule">
        <div className={styles.container}>
          <div className={`${styles.featureSplit} ${styles.featureSplitReverse}`}>
            <div className={styles.featureText}>
              <span className={styles.featureTag}>타임캡슐 (Time Capsule)</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '24px', lineHeight: 1.3 }}>
                감정이 해소된 순간,<br />나에게 편지를 보내세요
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '32px' }}>
                감정은 흘러갑니다. 지금 이 감정을 바로 공개하지 않고,{' '}
                <strong>내가 원하는 날</strong>에 열리도록 봉인해두세요.
              </p>
              <ul className={styles.checkList}>
                <li><strong>공개 시점 직접 설정:</strong> 원하는 날짜와 시간을 직접 입력해 공개를 예약하세요.</li>
                <li><strong>30분 수정 가능:</strong> 작성 후 30분 이내에만 수정할 수 있어요. 이후엔 봉인됩니다.</li>
                <li><strong>과거의 나에게:</strong> 그때의 힘듦과 지금의 나를 비교해보는 회고의 시간.</li>
              </ul>
            </div>
            <div className={styles.featureVisual} style={{ background: '#fff' }}>
              <div className={styles.capsuleUi}>
                <div className={styles.toastNoti}>
                  <div className={styles.notiIcon} />
                  <div style={{ fontSize: '0.85rem' }}><strong>1년 전의 나</strong>로부터 편지가 도착했습니다.</div>
                </div>
                <div className={styles.mailCard}>
                  <span className={styles.mailIconLock}>🔒</span>
                  <div className={styles.mailTitle}>1년 전의 편지</div>
                  <div className={styles.mailDesc}>
                    이 편지는 2027년 1월 15일에 열립니다.<br />그때의 나는 어떤 기분일까요?
                  </div>
                  <div className={styles.mailDate}>
                    <span>D-365</span>
                    <span className={styles.unlockBadge}>잠김</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={`${styles.section} ${styles.sectionGray}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>시작하기</span>
            <h2>3단계로 충분해요</h2>
            <p>복잡한 설정 없이, 지금 바로 시작할 수 있어요.</p>
          </div>
          <div className={styles.howItWorksGrid}>
            {[
              {
                step: '01',
                icon: '✍️',
                title: '감정을 기록하세요',
                desc: '오늘 어떤 감정을 느꼈나요? 감정을 선택하고 장소와 함께 솔직하게 남겨보세요.',
              },
              {
                step: '02',
                icon: '🗺️',
                title: '주변을 탐색하세요',
                desc: '지도 위에서 내 주변 사람들이 어떤 장소에서 어떤 감정을 느꼈는지 발견하세요.',
              },
              {
                step: '03',
                icon: '🌿',
                title: '위로를 발견하세요',
                desc: '누군가의 솔직한 기록이 오늘의 나에게 작은 위로가 됩니다.',
              },
            ].map((item) => (
              <div key={item.step} className={styles.howItWorksCard}>
                <div className={styles.howItWorksStep}>{item.step}</div>
                <div className={styles.howItWorksIcon}>{item.icon}</div>
                <h3 className={styles.howItWorksTitle}>{item.title}</h3>
                <p className={styles.howItWorksDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY ── */}
      <section className={`${styles.section} ${styles.sectionGray}`} id="community">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>실시간 아카이브</span>
            <h2>지금, 이 순간의 기록들</h2>
            <p>다른 사람들은 어떤 장소에서 어떤 감정을 느끼고 있을까요?<br />공개된 아카이브를 통해 새로운 장소를 발견하세요.</p>
          </div>

          <div className={styles.communityGrid}>
            {([
              { emotion: 'CALM',  name: '서울숲단골',   time: '10분 전',  text: '복잡한 머릿속을 비우려 서울숲을 걸었습니다. 나무 사이로 들어오는 햇살이 큰 위로가 되었어요.', loc: '서울숲 가족마당' },
              { emotion: 'SAD',   name: '새벽감성',    time: '30분 전',  text: '힘든 날, 동네 서점에서 우연히 만난 책 한 권이 큰 위로가 되었습니다. 조용해서 좋았어요.',      loc: '연남동 독립서점' },
              { emotion: 'HAPPY', name: '한강피크닉러', time: '1시간 전', text: '오랜만에 친구들과 한강 피크닉! 날씨도 좋고 맛있는 것도 먹고 완벽한 하루였어요.',          loc: '여의도 한강공원' },
            ] as const).map((item, i) => {
              const tag = EMOTION_TAG_STYLE[item.emotion] ?? { bg: '#F3F4F6', text: '#6B7280' };
              const emoji = EMOTION_EMOJI[item.emotion] ?? '📍';
              const label = EMOTION_LABEL[item.emotion] ?? item.emotion;
              return (
              <div key={i} className={styles.feedCard}>
                <div className={styles.feedHeader}>
                  <div className={styles.feedUser}>
                    <div className={styles.userAvatar} style={{ background: tag.bg }}>{emoji}</div>
                    <span>{item.name}</span>
                  </div>
                  <span className={styles.feedDate}>{item.time}</span>
                </div>
                <div className={styles.feedBody}>
                  <span className={styles.feedTag} style={{ background: tag.bg, color: tag.text }}>
                    {emoji} {label}
                  </span>
                  <p className={styles.feedText}>{item.text}</p>
                  <div className={styles.feedLoc}>📍 {item.loc}</div>
                </div>
              </div>
            )})}
          </div>

          <div className={styles.feedMoreContainer}>
            <Link href="/signup" className={styles.feedMoreBtn}>더 많은 아카이브 보기 ↓</Link>
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className={styles.trustSection}>
        <div className={styles.container}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'white', padding: '12px 30px', borderRadius: '50px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            <span style={{ fontSize: '1.2rem' }}>✅</span>
            <span style={{ fontWeight: 700, color: '#333', fontSize: '1rem' }}>개인 경험 공유 및 아카이빙 플랫폼</span>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.faqSection} id="faq">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>자주 묻는 질문</span>
            <h2>궁금한 점이 있으신가요?</h2>
            <p>Feel-Archive 이용에 대해 궁금한 점을 확인하세요.</p>
          </div>
          <div className={styles.faqGrid}>
            {FAQS.map((faq, i) => (
              <div key={i} className={`${styles.faqItem} ${openFaqIndex === i ? styles.faqItemActive : ''}`}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span className={`${styles.faqIcon} ${openFaqIndex === i ? styles.faqIconActive : ''}`}>+</span>
                </button>
                {openFaqIndex === i && (
                  <div className={styles.faqAnswer}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>
            당신의 기록이<br />누군가의 위로가 됩니다.
          </h2>
          <p style={{ opacity: 0.8, fontSize: '1.1rem', marginBottom: '40px' }}>
            지금 Feel-Archive에서 감정을 기록하고, 주변의 위로를 발견해보세요.
          </p>
          <Link href="/signup" className={styles.btnLarge}>무료로 시작하기</Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerLinks}>
            <a href="#">서비스 소개</a>
            <a href="#">이용약관</a>
            <a href="#">개인정보처리방침</a>
            <a href="#">문의하기</a>
          </div>
          <div className={styles.footerCopy}>© 2026 Feel-Archive. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
