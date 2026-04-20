import { useEffect, useRef, useState } from "react";

interface NaverMapProps {
  spots: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    category: string;
    description?: string;
  }>;
  onMarkerClick?: (spotId: string) => void;
  height?: string;
}

declare global {
  interface Window {
    naver: any;
  }
}

export function NaverMap({ spots, onMarkerClick, height = "500px" }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !window.naver) {
      console.warn("Naver Map SDK not loaded yet");
      setIsReady(false);
      return;
    }

    setIsReady(true);

    // 부산 중심 좌표
    const busanCenter = new window.naver.maps.LatLng(35.1796, 129.0756);

    // 지도 초기화
    mapInstance.current = new window.naver.maps.Map(mapRef.current, {
      center: busanCenter,
      zoom: 12,
      mapTypeControl: true,
      zoomControl: true,
    });

    // 마커 추가
    spots.forEach((spot) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(spot.lat, spot.lng),
        map: mapInstance.current,
        title: spot.name,
      });

      // 마커 클릭 이벤트
      window.naver.maps.Event.addListener(marker, "click", () => {
        if (onMarkerClick) {
          onMarkerClick(spot.id);
        }

        // 정보 윈도우 표시
        const infoWindow = new window.naver.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 200px;">
              <h4 style="margin: 0 0 5px 0; font-weight: bold;">${spot.name}</h4>
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">${spot.category}</p>
              ${spot.description ? `<p style="margin: 0; font-size: 12px;">${spot.description}</p>` : ""}
            </div>
          `,
          position: marker.getPosition(),
        });

        infoWindow.open(mapInstance.current, marker);
      });
    });

    // 모든 마커가 보이도록 지도 범위 조정
    if (spots.length > 0) {
      const bounds = new window.naver.maps.LatLngBounds();
      spots.forEach((spot) => {
        bounds.extend(new window.naver.maps.LatLng(spot.lat, spot.lng));
      });
      mapInstance.current.fitBounds(bounds);
    }
  }, [spots, onMarkerClick]);

  if (!isReady) {
    return (
      <div
        style={{
          width: "100%",
          height: height,
          borderRadius: "8px",
          overflow: "hidden",
        }}
        className="map-fallback flex items-center justify-center px-6 text-center text-sm"
      >
        Naver Map SDK is not configured in mock mode.
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: height,
        borderRadius: "8px",
        overflow: "hidden",
      }}
    />
  );
}
