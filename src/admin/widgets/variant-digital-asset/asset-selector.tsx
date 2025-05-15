// src/admin/widgets/variant-digital-asset/asset-selector.tsx
import { Button, Text, Tooltip } from "@medusajs/ui";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { DigitalAsset, DigitalAssetPaginatedResponse } from "../../../types/digital-asset.types";
import { useDigitalAssets } from "../../hooks/use-digital-assets";

interface IAssetSelectorProps {
  variantId: string;
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string | null) => void;
  onLink: (assetId: string) => void;
  isLinking: boolean;
}

export const AssetSelector = ({
  variantId,
  selectedAssetId,
  setSelectedAssetId,
  onLink,
  isLinking,
}: IAssetSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const debouncedSearch = useCallback((value: string) => {
    const debouncedFn = debounce(() => {
      setDebouncedSearchTerm(value);
    }, 500);

    debouncedFn();
  }, []);

  const {
    data: digitalAssets,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useDigitalAssets(debouncedSearchTerm, showDropdown, variantId);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  const filteredAssets =
    digitalAssets?.pages.flatMap((page: DigitalAssetPaginatedResponse) =>
      page.digital_assets.filter((asset: DigitalAsset) =>
        asset.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      ),
    ) || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const selectedAsset = filteredAssets.find((a) => a.id === selectedAssetId);

  return (
    <div className="mt-6">
      <Text className="text-ui-fg-subtle mb-1 ml-[0.5px]">디지털 자산 연결하기</Text>

      <div className="flex items-center gap-2">
        <div className="flex-1 max-w-md relative">
          <div
            className="border rounded p-2 h-10 cursor-pointer flex justify-between items-center"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <span>
              {selectedAssetId && selectedAsset ? selectedAsset.name : "디지털 자산 선택"}
            </span>
            <span>▼</span>
          </div>

          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
            >
              <div className="p-2 border-b">
                <input
                  type="text"
                  placeholder="자산 검색..."
                  value={searchTerm}
                  onChange={handleSearchInput}
                  className="w-full p-2 rounded border border-gray-200 text-sm focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="overflow-y-auto max-h-40" onScroll={handleScroll}>
                {isPending || debouncedSearchTerm !== searchTerm ? (
                  <div className="p-2 text-center">로딩 중...</div>
                ) : filteredAssets.length === 0 ? (
                  <div className="p-2 text-center">사용 가능한 디지털 자산 없음</div>
                ) : (
                  filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className={`p-2 ml-2 hover:bg-gray-100 cursor-pointer ${selectedAssetId === asset.id ? "bg-gray-100" : ""}`}
                      onClick={() => {
                        setSelectedAssetId(asset.id);
                        setShowDropdown(false);
                      }}
                    >
                      {asset.name}
                    </div>
                  ))
                )}
                {isFetchingNextPage && <div className="p-2 text-center">더 불러오는 중...</div>}
              </div>
            </div>
          )}
        </div>

        <Tooltip
          content={
            !selectedAssetId || !selectedAsset
              ? "디지털 자산을 먼저 선택하세요"
              : "디지털 자산 연결"
          }
        >
          <Button
            variant="primary"
            disabled={!selectedAssetId || !selectedAsset || isLinking}
            className="h-10"
            onClick={() => {
              if (selectedAssetId && selectedAsset) {
                onLink(selectedAssetId);
              }
            }}
            isLoading={isLinking}
          >
            연결하기
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
