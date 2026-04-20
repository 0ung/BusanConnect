import { useLanguage } from "@/contexts/LanguageContext";
import { api } from "@/lib/api";
import { MapView } from "@/components/Map";
import { SacredGeometryBackground } from "@/components/SacredGeometry";
import { useState, useCallback } from "react";
import { MapPin, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearch } from "wouter";

interface SpotInfo {
  id: number;
  name: string;
  description: string;
  category: string;
  address: string | null;
  rating: number | null;
  imageUrl: string | null;
  lat: number;
  lng: number;
}

export default function MapPage() {
  const { t, language } = useLanguage();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const focusLat = params.get("lat") ? parseFloat(params.get("lat")!) : null;
  const focusLng = params.get("lng") ? parseFloat(params.get("lng")!) : null;

  const { data: spots } = api.guides.list.useQuery({});
  const [selectedSpot, setSelectedSpot] = useState<SpotInfo | null>(null);

  function getSpotName(spot: Record<string, unknown>) {
    const key = `name${language.charAt(0).toUpperCase() + language.slice(1)}`;
    return (spot[key] as string) || (spot["nameKo"] as string) || "";
  }
  function getSpotDesc(spot: Record<string, unknown>) {
    const key = `description${language.charAt(0).toUpperCase() + language.slice(1)}`;
    return (spot[key] as string) || (spot["descriptionKo"] as string) || "";
  }

  const handleMapReady = useCallback(
    (map: google.maps.Map) => {
      if (!spots) return;

      const center = focusLat && focusLng
        ? { lat: focusLat, lng: focusLng }
        : { lat: 35.1796, lng: 129.0756 };

      map.setCenter(center);
      map.setZoom(focusLat ? 15 : 12);

      const infoWindow = new google.maps.InfoWindow();

      spots.forEach((spot) => {
        if (!spot.latitude || !spot.longitude) return;
        const lat = parseFloat(spot.latitude);
        const lng = parseFloat(spot.longitude);
        if (isNaN(lat) || isNaN(lng)) return;

        const name = getSpotName(spot as unknown as Record<string, unknown>);

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map,
          title: name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#0066ff",
            fillOpacity: 1,
            strokeColor: "oklch(22% 0.06 250)",
            strokeWeight: 2,
          },
        });

        marker.addListener("click", () => {
          setSelectedSpot({
            id: spot.id,
            name,
            description: getSpotDesc(spot as unknown as Record<string, unknown>),
            category: spot.category,
            address: spot.address,
            rating: spot.rating,
            imageUrl: spot.imageUrl,
            lat,
            lng,
          });
          map.panTo({ lat, lng });
        });
      });
    },
    [spots, focusLat, focusLng, language]
  );

  const categoryLabels: Record<string, string> = {
    attraction: t("guide.category.attraction"),
    restaurant: t("guide.category.restaurant"),
    accommodation: t("guide.category.accommodation"),
    shopping: t("guide.category.shopping"),
    culture: t("guide.category.culture"),
  };

  return (
    <div className="page-shell min-h-screen">
      {/* Header */}
      <section className="section-brand relative py-16 overflow-hidden">
        <SacredGeometryBackground />
        <div className="container relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-white/20" />
            <MapPin className="w-5 h-5 text-white/70" />
            <div className="h-px w-16 bg-white/20" />
          </div>
          <h1 className="font-display text-4xl font-bold text-contrast mb-2">
            {t("map.title")}
          </h1>
          <p className="font-display italic text-white/80">{t("map.subtitle")}</p>
        </div>
      </section>

      {/* Map + Sidebar */}
      <section className="py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Spot List */}
            <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-1">
              <h3 className="font-semibold text-navy text-sm uppercase tracking-widest mb-4">
                {t("guide.category.all")} ({spots?.length ?? 0})
              </h3>
              {spots?.map((spot) => {
                const name = getSpotName(spot as unknown as Record<string, unknown>);
                return (
                  <button
                    key={spot.id}
                    onClick={() => {
                      if (!spot.latitude || !spot.longitude) return;
                      setSelectedSpot({
                        id: spot.id,
                        name,
                        description: getSpotDesc(spot as unknown as Record<string, unknown>),
                        category: spot.category,
                        address: spot.address,
                        rating: spot.rating,
                        imageUrl: spot.imageUrl,
                        lat: parseFloat(spot.latitude),
                        lng: parseFloat(spot.longitude),
                      });
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedSpot?.id === spot.id
                        ? "surface-card border-ocean/45 bg-ocean-light/25 shadow-sm"
                        : "surface-card hover:border-ocean/35"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {spot.imageUrl && (
                        <img
                          src={spot.imageUrl}
                          alt={name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs font-medium text-ocean-dark">
                            {categoryLabels[spot.category]}
                          </span>
                          {spot.rating && (
                            <span className="text-muted flex items-center gap-0.5 text-xs">
                              <Star className="w-2.5 h-2.5 fill-ocean text-ocean" />
                              {spot.rating}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-navy truncate">{name}</p>
                        {spot.address && (
                          <p className="text-subtle mt-0.5 truncate text-xs">{spot.address}</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Map */}
            <div className="lg:col-span-2 relative">
              <div className="surface-card overflow-hidden rounded-2xl" style={{ height: "600px" }}>
                <MapView
                  onMapReady={handleMapReady}
                  className="w-full h-full"
                />
              </div>

              {/* Selected Spot Popup */}
              {selectedSpot && (
                <div className="surface-card absolute bottom-4 left-4 right-4 z-10 rounded-xl p-4 shadow-lg">
                  <div className="flex items-start gap-3">
                    {selectedSpot.imageUrl && (
                      <img
                        src={selectedSpot.imageUrl}
                        alt={selectedSpot.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-ocean-dark">
                          {categoryLabels[selectedSpot.category]}
                        </span>
                        <button
                          onClick={() => setSelectedSpot(null)}
                          className="text-subtle hover:text-navy"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="font-display font-bold text-navy text-base mb-1">{selectedSpot.name}</h4>
                      {selectedSpot.rating && (
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-3.5 h-3.5 fill-ocean text-ocean" />
                          <span className="text-sm font-semibold text-ocean-dark">{selectedSpot.rating}</span>
                        </div>
                      )}
                      {selectedSpot.address && (
                        <p className="text-muted flex items-center gap-1 text-xs">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          {selectedSpot.address}
                        </p>
                      )}
                      <p className="text-subtle mt-1.5 line-clamp-2 text-xs leading-relaxed">
                        {selectedSpot.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
