import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Key } from "@medusajs/icons";
import { Badge, Button, Container, Heading, Table, Text } from "@medusajs/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useDigitalAssetLicense } from "./_hooks/use-digital-asset-license";
import { useRevokeLicense } from "./_hooks/use-revoke-license";
import { DigitalAssetLicense } from "../../../../.medusa/types/query-entry-points";
import { Pagination } from "../../components/ui/pagination";
import dayjs from "dayjs";

type LicenseWithFields = DigitalAssetLicense & {
  digital_asset_id: string;
};

const LIMIT = 10;

const LicensesPage = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isPending } = useDigitalAssetLicense(page, LIMIT);

  const revokeLicense = useRevokeLicense(queryClient);

  const handleRevokeClick = (licenseId: string) => {
    if (window.confirm("이 라이선스를 취소하시겠습니까?")) {
      revokeLicense.mutate(licenseId);
    }
  };

  const totalPages = data?.pagination?.count ? Math.ceil(data.pagination.count / LIMIT) : 0;

  return (
    <Container className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <Heading level="h2">디지털 자산 라이선스 관리</Heading>
      </div>

      {isPending ? (
        <Text>라이선스 정보를 불러오는 중...</Text>
      ) : data?.licenses?.length && data?.licenses?.length > 0 ? (
        <>
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
                  <Table.Cell>{license.id}</Table.Cell>
                  <Table.Cell>{(license as LicenseWithFields).digital_asset_id}</Table.Cell>
                  <Table.Cell>{license.customer_id}</Table.Cell>
                  <Table.Cell>{license.order_item_id}</Table.Cell>
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

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={data.pagination.count}
            pageSize={LIMIT}
            onPageChange={setPage}
          />
        </>
      ) : (
        <Text className="text-gray-500">라이선스 내역이 없습니다.</Text>
      )}
    </Container>
  );
};

export default LicensesPage;

export const config = defineRouteConfig({
  label: "Licenses",
  icon: Key,
});
