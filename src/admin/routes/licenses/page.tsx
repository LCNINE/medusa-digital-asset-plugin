import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Key } from "@medusajs/icons";
import { Badge, Button, Container, Heading, Table, Text } from "@medusajs/ui";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { DigitalAssetLicense } from "../../../../.medusa/types/query-entry-points";
import { Pagination } from "../../components/ui/pagination";
import { LicenseTableSkeleton } from "./_components/license-table-skeleton";
import { useDigitalAssetLicense } from "./_hooks/use-digital-asset-license";
import { useRevokeLicense } from "./_hooks/use-revoke-license";

type LicenseWithFields = DigitalAssetLicense & {
  digital_asset_id: string;
};

const LIMIT = 10;

const LicensesPage = () => {
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const queryClient = useQueryClient();

  const { data, isPending } = useDigitalAssetLicense(page, LIMIT);

  const revokeLicense = useRevokeLicense(queryClient);

  const handleRevokeClick = (licenseId: string) => {
    if (window.confirm("이 라이선스를 취소하시겠습니까?")) {
      revokeLicense.mutate(licenseId);
    }
  };

  const totalPages = data?.pagination?.count ? Math.ceil(data.pagination.count / LIMIT) : 0;

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const renderMobileCards = () => {
    return data?.licenses?.map((license) => (
      <div
        key={license.id}
        className="mb-4 p-4 border border-ui-border-base rounded-lg bg-ui-bg-base shadow-ui-card"
      >
        <div className="space-y-2">
          <div className="flex justify-between">
            <Text size="small" className="text-ui-fg-subtle">
              ID
            </Text>
            <Text className="font-medium text-ui-fg-base">{license.id.substring(0, 8)}...</Text>
          </div>
          <div className="flex justify-between">
            <Text size="small" className="text-ui-fg-subtle">
              디지털 자산 ID
            </Text>
            <Text className="font-medium text-ui-fg-base">
              {(license as LicenseWithFields).digital_asset_id.substring(0, 8)}...
            </Text>
          </div>
          <div className="flex justify-between">
            <Text size="small" className="text-ui-fg-subtle">
              고객 ID
            </Text>
            <Text className="font-medium text-ui-fg-base">
              {license.customer_id.substring(0, 8)}...
            </Text>
          </div>
          <div className="flex justify-between">
            <Text size="small" className="text-ui-fg-subtle">
              주문 아이템 ID
            </Text>
            <Text className="font-medium text-ui-fg-base">
              {license.order_item_id.substring(0, 8)}...
            </Text>
          </div>
          <div className="flex justify-between items-center">
            <Text size="small" className="text-ui-fg-subtle">
              상태
            </Text>
            {license.is_exercised ? (
              <Badge color="green">사용됨</Badge>
            ) : (
              <Badge color="blue">미사용</Badge>
            )}
          </div>
          <div className="flex justify-between">
            <Text size="small" className="text-ui-fg-subtle">
              생성일
            </Text>
            <Text className="font-medium text-ui-fg-base">
              {dayjs(license.created_at).format("YYYY-MM-DD")}
            </Text>
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              variant="secondary"
              size="small"
              disabled={license.is_exercised}
              onClick={() => handleRevokeClick(license.id)}
            >
              취소
            </Button>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col gap-y-3">
      <Container>
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <Heading level="h2" className="mb-2 sm:mb-0">
            디지털 자산 라이선스 관리
          </Heading>
        </div>
      </Container>

      <Container>
        {isPending ? (
          <LicenseTableSkeleton />
        ) : data?.licenses?.length && data?.licenses?.length > 0 ? (
          <>
            {isMobile ? (
              <div className="space-y-4">{renderMobileCards()}</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>ID</Table.HeaderCell>
                      <Table.HeaderCell>디지털 자산 ID</Table.HeaderCell>
                      <Table.HeaderCell>고객 ID</Table.HeaderCell>
                      <Table.HeaderCell>주문 아이템 ID</Table.HeaderCell>
                      <Table.HeaderCell>상태</Table.HeaderCell>
                      <Table.HeaderCell>생성일</Table.HeaderCell>
                      <Table.HeaderCell>액션</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {data.licenses.map((license) => (
                      <Table.Row key={license.id}>
                        <Table.Cell className="max-w-[120px] truncate">{license.id}</Table.Cell>
                        <Table.Cell className="max-w-[120px] truncate">
                          {(license as LicenseWithFields).digital_asset_id}
                        </Table.Cell>
                        <Table.Cell className="max-w-[120px] truncate">
                          {license.customer_id}
                        </Table.Cell>
                        <Table.Cell className="max-w-[120px] truncate">
                          {license.order_item_id}
                        </Table.Cell>
                        <Table.Cell>
                          {license.is_exercised ? (
                            <Badge color="green">사용됨</Badge>
                          ) : (
                            <Badge color="blue">미사용</Badge>
                          )}
                        </Table.Cell>
                        <Table.Cell>{dayjs(license.created_at).format("YYYY-MM-DD")}</Table.Cell>
                        <Table.Cell>
                          <Button
                            variant="secondary"
                            size="small"
                            disabled={license.is_exercised}
                            onClick={() => handleRevokeClick(license.id)}
                          >
                            취소
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            )}

            <div className="mt-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={data.pagination.count}
                pageSize={LIMIT}
                onPageChange={setPage}
              />
            </div>
          </>
        ) : (
          <Text className="text-ui-fg-subtle">라이선스 내역이 없습니다.</Text>
        )}
      </Container>
    </div>
  );
};

export default LicensesPage;

export const config = defineRouteConfig({
  label: "Licenses",
  icon: Key,
});
