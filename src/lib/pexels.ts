import { getPostFeaturedImage, getPostSecondaryImage } from "@/lib/posts";

/**
 * Pexels 이미지 정보 인터페이스
 */
export interface PexelsImage {
  id: number;
  url: string;        // 고화질 이미지 URL
  medium: string;     // 중간 크기 이미지 URL
  thumbnail: string;  // 작은 썸네일 URL
  alt: string;        // 이미지 설명
  photographer: string; // 사진작가 이름
  photographerUrl: string; // 사진작가 프로필 링크
}

// 메모리 캐시 (빌드 중 동일 키워드로 API가 중복 호출되는 것 방지)
const memoryCache = new Map<string, PexelsImage[]>();

/**
 * Pexels API에서 검색어로 사진들을 가져오는 함수
 * @param query 검색 키워드 (예: "korea festival", "baby family")
 * @param perPage 가져올 이미지 수
 */
export async function searchPexelsImages(query: string, perPage = 5): Promise<PexelsImage[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  const cacheKey = `${query}_${perPage}`;

  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }

  if (!apiKey) {
    console.warn("⚠️ PEXELS_API_KEY가 .env.local에 설정되지 않아 기본 이미지를 사용합니다.");
    return [];
  }

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
      {
        headers: {
          Authorization: apiKey,
        },
        // 하루(86400초) 동안 캐시
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      console.warn(`Pexels API 응답 오류 (${res.status}): ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    if (!data.photos || !Array.isArray(data.photos)) {
      return [];
    }

    const images: PexelsImage[] = data.photos.map((photo: any) => ({
      id: photo.id,
      url: photo.src.large2x || photo.src.large,
      medium: photo.src.medium,
      thumbnail: photo.src.small || photo.src.tiny,
      alt: photo.alt || `${query} image`,
      photographer: photo.photographer || "Pexels Creator",
      photographerUrl: photo.photographer_url || "https://www.pexels.com",
    }));

    memoryCache.set(cacheKey, images);
    return images;
  } catch (error) {
    console.warn("Pexels API 호출 실패:", error);
    return [];
  }
}

/**
 * 글 제목과 카테고리를 분석해 가장 적절한 영문 검색 키워드를 반환하는 함수
 */
export function getKeywordForPost(title: string, category = ""): { primary: string; secondary: string } {
  const t = title.toLowerCase();

  // 축제, 문화, 행사
  if (t.includes("축제") || t.includes("페스티벌") || t.includes("문화") || t.includes("마켓") || t.includes("공연")) {
    return { primary: "festival crowd celebration", secondary: "street food festival concert" };
  }
  // 숲, 산책, 공원, 벚꽃, 도봉산, 북한산
  if (t.includes("산책") || t.includes("공원") || t.includes("벚꽃") || t.includes("도봉산") || t.includes("북한산") || t.includes("정원")) {
    return { primary: "korea mountain forest park", secondary: "spring cherry blossom flowers" };
  }
  // 출산, 육아, 아이, 아동, 첫만남
  if (t.includes("출산") || t.includes("육아") || t.includes("아이") || t.includes("아동") || t.includes("첫만남") || t.includes("산후")) {
    return { primary: "happy family baby newborn", secondary: "parents playing with baby" };
  }
  // 교육, 장학, 학교, 도서관, 청년
  if (t.includes("교육") || t.includes("장학") || t.includes("청년") || t.includes("학생") || t.includes("도서관") || t.includes("취업")) {
    return { primary: "student studying laptop university", secondary: "graduation scholarship education books" };
  }
  // 노인, 어르신, 실버, 보훈
  if (t.includes("어르신") || t.includes("노인") || t.includes("실버") || t.includes("보훈") || t.includes("유공자")) {
    return { primary: "happy active elderly smiling korean", secondary: "senior grandparents talking park" };
  }
  // 건강, 의료, 병원, 안심, 보험
  if (t.includes("의료") || t.includes("건강") || t.includes("보험") || t.includes("안심") || t.includes("병원") || t.includes("임산부")) {
    return { primary: "healthcare doctor clinic hospital", secondary: "healthy lifestyle stethoscope" };
  }
  // 지원금, 화폐, 지역화폐, 수당, 세금, 금융
  if (t.includes("지원금") || t.includes("화폐") || t.includes("상품권") || t.includes("수당") || t.includes("세금") || t.includes("장려금") || t.includes("월세")) {
    return { primary: "korean money finance budget savings", secondary: "digital wallet mobile payment money" };
  }
  // 치아, 구강, 치과
  if (t.includes("치아") || t.includes("구강") || t.includes("치과")) {
    return { primary: "dental clinic dentist smiling healthy teeth", secondary: "dental care toothbrush checkup" };
  }
  // 장애인, 보장구, 휠체어, 이동기기
  if (t.includes("장애") || t.includes("보장구") || t.includes("휠체어") || t.includes("보조기기")) {
    return { primary: "accessibility wheelchair rehabilitation support", secondary: "caregiver helping rehabilitation therapy" };
  }
  // 집수리, 주거, 환경개선, 태양광
  if (t.includes("주거") || t.includes("집수리") || t.includes("태양광") || t.includes("에너지") || t.includes("가스")) {
    return { primary: "modern eco home interior house renovation", secondary: "clean living room solar eco house" };
  }
  // 다문화, 외국인
  if (t.includes("다문화") || t.includes("글로벌")) {
    return { primary: "diverse multiracial friends community smiling", secondary: "global cultural celebration togetherness" };
  }
  // 수산, 어업, 바다, 선박
  if (t.includes("수산") || t.includes("어업") || t.includes("어선") || t.includes("바다") || t.includes("해양")) {
    return { primary: "ocean fishing boat sea port", secondary: "fresh seafood fish harbor" };
  }

  // 기본 키워드 (지역 생활, 서울 풍경)
  return { primary: "seoul korea city architecture", secondary: "community life people neighborhood" };
}

/**
 * Pexels API에서 해당 글에 가장 어울리는 대표 이미지와 보조 이미지를 가져오는 함수
 */
export async function getPostPexelsImages(
  post: { title: string; category?: string; image?: string }
): Promise<{ featured: PexelsImage; secondary: PexelsImage }> {
  const { primary, secondary } = getKeywordForPost(post.title, post.category);

  const defaultFeaturedUrl = getPostFeaturedImage(post);
  const defaultSecondaryUrl = getPostSecondaryImage(post);

  // post.image가 있고, pexels 도메인이거나 로컬 이미지 등 안전한 경우에만 우선 사용
  const isSafeCustomImage =
    post.image &&
    post.image.trim() !== "" &&
    (post.image.includes("images.pexels.com") || post.image.startsWith("/"));

  const customFeaturedUrl = isSafeCustomImage ? post.image! : defaultFeaturedUrl;

  const fallbackFeatured: PexelsImage = {
    id: 0,
    url: customFeaturedUrl,
    medium: customFeaturedUrl,
    thumbnail: customFeaturedUrl,
    alt: post.title,
    photographer: "Pexels Creator",
    photographerUrl: "https://www.pexels.com",
  };

  const fallbackSecondary: PexelsImage = {
    id: 1,
    url: defaultSecondaryUrl,
    medium: defaultSecondaryUrl,
    thumbnail: defaultSecondaryUrl,
    alt: `${post.title} 안내`,
    photographer: "Pexels Creator",
    photographerUrl: "https://www.pexels.com",
  };

  // 1. 직접 지정된 검증된 이미지가 있다면 우선 사용
  if (isSafeCustomImage) {
    return { featured: fallbackFeatured, secondary: fallbackSecondary };
  }

  // 2. Pexels API로 검색
  const [primaryList, secondaryList] = await Promise.all([
    searchPexelsImages(primary, 3),
    searchPexelsImages(secondary, 3),
  ]);

  const featured = primaryList[0] || fallbackFeatured;
  // 두 번째 이미지는 primary의 다음 사진이나 secondary 결과 사용
  const secondaryImg = secondaryList[0] || primaryList[1] || fallbackSecondary;

  return {
    featured: { ...featured, alt: post.title },
    secondary: { ...secondaryImg, alt: `${post.title} 상세 안내` },
  };
}
