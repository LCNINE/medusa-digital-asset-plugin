import { Button, Text } from "@medusajs/ui";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { Customer } from "../../../.medusa/types/query-entry-points";
import { useCustomers } from "../hooks/use-customer";

interface ICustomerSelectorProps {
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
  selectedCustomer: Customer | null;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
}

export const CustomerSelector = ({
  selectedCustomerId,
  setSelectedCustomerId,
  selectedCustomer,
  setSelectedCustomer,
}: ICustomerSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useCallback((value: string) => {
    const debouncedFn = debounce(() => {
      setDebouncedSearchTerm(value);
    }, 500);

    debouncedFn();
  }, []);

  const {
    data: customerPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useCustomers({ debouncedSearchTerm, showDropdown });

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

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setSelectedCustomer(customer);
    setShowDropdown(false);
  };

  const customers = customerPages?.pages.flatMap((page) => page.customers) || [];

  const renderCustomerInfo = (customer: Customer) => (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className="font-medium">{`${customer.first_name} ${customer.last_name}`}</span>
        <span className="text-ui-fg-subtle text-sm">{customer.id}</span>
      </div>
      <span className="text-ui-fg-subtle text-sm">{customer.email}</span>
    </div>
  );

  return (
    <div className="mt-6">
      <Text className="text-ui-fg-subtle mb-1 ml-[0.5px]">고객 연결하기</Text>

      <div className="flex items-center gap-2">
        <div className="flex-1 max-w-md relative">
          <Button
            type="button"
            variant="secondary"
            className="w-full justify-start"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <span>
              {selectedCustomer
                ? `${selectedCustomer.first_name} ${selectedCustomer.last_name} (${selectedCustomer.email})`
                : "고객 선택"}
            </span>
            <span className="ml-auto">▼</span>
          </Button>

          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute z-10 mt-1 w-full bg-ui-bg-base border border-ui-border-base rounded-md shadow-lg max-h-60 overflow-auto"
            >
              <div className="p-2 border-b border-ui-border-base">
                <input
                  type="text"
                  placeholder="고객ID, 이메일, 이름 검색..."
                  value={searchTerm}
                  onChange={handleSearchInput}
                  className="w-full p-2 rounded border border-ui-border-base text-sm focus:outline-none bg-ui-bg-field text-ui-fg-base"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="overflow-y-auto max-h-40" onScroll={handleScroll}>
                {isPending || debouncedSearchTerm !== searchTerm ? (
                  <div className="p-2 text-center text-ui-fg-subtle">로딩 중...</div>
                ) : customers.length === 0 ? (
                  <div className="p-2 text-center text-ui-fg-subtle">연결 가능한 고객 없음</div>
                ) : (
                  customers.map((customer) => (
                    <div
                      key={customer.id}
                      className={`p-2 hover:bg-ui-bg-base-hover cursor-pointer ${
                        selectedCustomerId === customer.id
                          ? "bg-ui-bg-base-pressed text-ui-fg-base"
                          : "text-ui-fg-base bg-ui-bg-base"
                      }`}
                      onClick={() => handleCustomerSelect(customer)}
                    >
                      {renderCustomerInfo(customer)}
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
      </div>
    </div>
  );
};
