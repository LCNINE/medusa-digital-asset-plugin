import { Button, Text, Tooltip } from "@medusajs/ui";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { DigitalAsset } from "../../../../.medusa/types/query-entry-points";
import { DigitalAssetPaginatedResponse } from "../../../types/digital-asset.types";
import { useDigitalAssets } from "../../hooks/use-digital-assets";

interface IDigitalAssetSelectorProps {
  variantId?: string;
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string | null) => void;
  onLink?: (assetId: string) => void;
  isLinking: boolean;
  selectedAsset: DigitalAsset | null;
  setSelectedAsset: React.Dispatch<React.SetStateAction<DigitalAsset | null>>;
}

export const DigitalAssetSelector = ({
  variantId,
  selectedAssetId,
  setSelectedAssetId,
  onLink,
  isLinking,
  selectedAsset,
  setSelectedAsset,
}: IDigitalAssetSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedAssetCache, setSelectedAssetCache] = useState<DigitalAsset | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

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
  } = useDigitalAssets({ debouncedSearchTerm, showDropdown, variantId });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

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

  const handleAssetSelect = (asset: DigitalAsset) => {
    setSelectedAssetId(asset.id);
    setSelectedAssetCache(asset);
    setShowDropdown(false);
  };

  const filteredAssets =
    digitalAssets?.pages.flatMap((page: DigitalAssetPaginatedResponse) =>
      page.digital_assets.filter((asset: DigitalAsset) =>
        asset.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      ),
    ) || [];

  const computedSelectedAsset =
    filteredAssets.find((a) => a.id === selectedAssetId) ||
    (selectedAssetId && selectedAssetCache?.id === selectedAssetId ? selectedAssetCache : null);

  useEffect(() => {
    setSelectedAsset(computedSelectedAsset);
  }, [filteredAssets, selectedAssetId, selectedAssetCache, setSelectedAsset]);

  return (
    <div className="mt-6">
      <Text className="text-ui-fg-subtle mb-1 ml-[0.5px]">디지털 자산 연결하기</Text>

      <div className="flex items-center gap-2">
        <div className="flex-1 max-w-md relative">
          <div
            className="border border-ui-border-base rounded p-2 h-10 cursor-pointer flex justify-between items-center bg-ui-bg-base text-ui-fg-base"
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
              className="absolute z-10 mt-1 w-full bg-ui-bg-base border border-ui-border-base rounded-md shadow-lg max-h-60 overflow-auto"
            >
              <div className="p-2 border-b border-ui-border-base">
                <input
                  type="text"
                  placeholder="자산 검색..."
                  value={searchTerm}
                  onChange={handleSearchInput}
                  className="w-full p-2 rounded border border-ui-border-base text-sm focus:outline-none bg-ui-bg-field text-ui-fg-base"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="overflow-y-auto max-h-40" onScroll={handleScroll}>
                {isPending || debouncedSearchTerm !== searchTerm ? (
                  <div className="p-2 text-center text-ui-fg-subtle">로딩 중...</div>
                ) : filteredAssets.length === 0 ? (
                  <div className="p-2 text-center text-ui-fg-subtle">
                    사용 가능한 디지털 자산 없음
                  </div>
                ) : (
                  filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className={`p-2 ml-2 hover:bg-ui-bg-base-hover cursor-pointer ${
                        selectedAssetId === asset.id
                          ? "bg-ui-bg-base-pressed text-ui-fg-base"
                          : "text-ui-fg-base bg-ui-bg-base"
                      }`}
                      onClick={() => handleAssetSelect(asset)}
                    >
                      {asset.name}
                    </div>
                  ))
                )}
                {isFetchingNextPage && (
                  <div className="p-2 text-center text-ui-fg-subtle">더 불러오는 중...</div>
                )}
              </div>
            </div>
          )}
        </div>

        <DigitalAssetLinkButton
          selectedAssetId={selectedAssetId}
          selectedAsset={selectedAsset}
          onLink={onLink}
          isLinking={isLinking}
          variantId={variantId}
        />
      </div>
    </div>
  );
};

function DigitalAssetLinkButton({
  selectedAssetId,
  selectedAsset,
  onLink,
  isLinking,
  variantId,
}: Omit<IDigitalAssetSelectorProps, "setSelectedAssetId" | "setSelectedAsset"> & {
  selectedAsset: DigitalAsset | null;
}) {
  if (!variantId) return null;

  return (
    <Tooltip
      content={
        !selectedAssetId || !selectedAsset ? "디지털 자산을 먼저 선택하세요" : "디지털 자산 연결"
      }
    >
      <Button
        variant="primary"
        disabled={!selectedAssetId || !selectedAsset || isLinking}
        className="h-10 disabled:cursor-not-allowed"
        onClick={() => {
          if (selectedAssetId && selectedAsset) {
            onLink && onLink(selectedAssetId);
          }
        }}
        isLoading={isLinking}
      >
        연결하기
      </Button>
    </Tooltip>
  );
}
