import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { NaverMap } from "@/components/NaverMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Info } from "lucide-react";

interface BusanSpot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  description: string;
  address: string;
  hours?: string;
  phone?: string;
}

const BUSAN_SPOTS: BusanSpot[] = [
  {
    id: "1",
    name: "해운대 해수욕장",
    lat: 35.1595,
    lng: 129.1607,
    category: "명소",
    description: "부산에서 가장 유명한 해수욕장",
    address: "부산 해운대구 해운대로 264",
    hours: "24시간",
    phone: "051-1330",
  },
  {
    id: "2",
    name: "감천문화마을",
    lat: 35.1014,
    lng: 129.0627,
    category: "문화",
    description: "알록달록한 집들과 예술 작품이 있는 마을",
    address: "부산 사하구 감내로 203",
    hours: "24시간",
  },
  {
    id: "3",
    name: "자갈치 시장",
    lat: 35.0976,
    lng: 129.0733,
    category: "맛집",
    description: "부산의 대표 수산물 시장",
    address: "부산 중구 자갈치해변로 52",
    hours: "05:00 - 22:00",
    phone: "051-1330",
  },
  {
    id: "4",
    name: "태종대 유원지",
    lat: 35.0674,
    lng: 129.1108,
    category: "명소",
    description: "해안 절경과 등대가 있는 유원지",
    address: "부산 영도구 태종로 93",
    hours: "09:00 - 18:00",
    phone: "051-405-2711",
  },
  {
    id: "5",
    name: "광안리 해수욕장",
    lat: 35.1547,
    lng: 129.1195,
    category: "명소",
    description: "광안대교 야경이 아름다운 해변",
    address: "부산 수영구 광안해변로 219",
    hours: "24시간",
  },
  {
    id: "6",
    name: "부산 타워",
    lat: 35.1015,
    lng: 129.0705,
    category: "명소",
    description: "부산의 랜드마크, 전망대에서 부산 전경 감상",
    address: "부산 중구 중앙대로 15",
    hours: "10:00 - 23:00",
    phone: "051-1330",
  },
];

export default function NaverMapPage() {
  const { t } = useLanguage();
  const [selectedSpot, setSelectedSpot] = useState<BusanSpot | null>(null);
  const [filteredSpots, setFilteredSpots] = useState<BusanSpot[]>(BUSAN_SPOTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredSpots(BUSAN_SPOTS);
    } else {
      setFilteredSpots(BUSAN_SPOTS.filter((spot) => spot.category === selectedCategory));
    }
  }, [selectedCategory]);

  const categories = ["all", "명소", "문화", "맛집"];

  const handleMarkerClick = (spotId: string) => {
    const spot = BUSAN_SPOTS.find((s) => s.id === spotId);
    if (spot) {
      setSelectedSpot(spot);
    }
  };

  return (
    <div className="page-shell min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ocean-dark mb-2">
            부산 명소 지도
          </h1>
          <p className="text-muted">
            네이버 지도에서 부산의 주요 명소를 확인하세요
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? "soft-pill soft-pill-active"
                  : "soft-pill"
              }`}
            >
              {category === "all" ? "전체" : category}
            </button>
          ))}
        </div>

        {/* Map and Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="surface-card overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <NaverMap
                  spots={filteredSpots}
                  onMarkerClick={handleMarkerClick}
                  height="600px"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Spot List */}
          <div className="space-y-4">
            {selectedSpot ? (
              <Card className="surface-card sticky top-4 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-ocean-dark">
                    {selectedSpot.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedSpot.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-subtle text-sm font-medium">설명</p>
                    <p className="text-muted mt-1 text-sm">
                      {selectedSpot.description}
                    </p>
                  </div>

                  <div>
                    <p className="text-subtle text-sm font-medium">주소</p>
                    <p className="text-muted mt-1 text-sm">
                      {selectedSpot.address}
                    </p>
                  </div>

                  {selectedSpot.hours && (
                    <div>
                      <p className="text-subtle text-sm font-medium">영업 시간</p>
                      <p className="text-muted mt-1 text-sm">
                        {selectedSpot.hours}
                      </p>
                    </div>
                  )}

                  {selectedSpot.phone && (
                    <div>
                      <p className="text-subtle text-sm font-medium">전화</p>
                      <p className="text-muted mt-1 text-sm">
                        {selectedSpot.phone}
                      </p>
                    </div>
                  )}

                  <div className="info-panel mt-4 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Info className="text-ocean-dark mt-0.5 h-4 w-4 flex-shrink-0" />
                      <p className="text-xs text-blue-700">
                        지도에서 다른 마커를 클릭하여 다른 명소를 확인하세요
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="surface-card shadow-lg">
                <CardContent className="py-8 text-center">
                  <MapPin className="text-muted mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p className="text-muted">
                    지도에서 마커를 클릭하여 명소 정보를 확인하세요
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Spots List */}
            <Card className="surface-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">명소 목록</CardTitle>
                <CardDescription>
                  {filteredSpots.length}개의 명소
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {filteredSpots.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => setSelectedSpot(spot)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedSpot?.id === spot.id
                        ? "bg-ocean-dark/10 border-ocean-dark"
                        : "border-border hover:bg-background/60"
                    }`}
                  >
                    <p className="font-medium text-foreground">{spot.name}</p>
                    <p className="text-muted mt-1 text-xs">{spot.category}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Naver Map SDK 로드 스크립트 */}
        <script
          type="text/javascript"
          src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_NAVER_MAP_CLIENT_ID"
          async
          defer
        ></script>
      </div>
    </div>
  );
}
