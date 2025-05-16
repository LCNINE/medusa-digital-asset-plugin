import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Text, Table, Button, Badge } from "@medusajs/ui";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type License = {
  id: string;
  digital_asset_id: string;
  customer_id: string;
  order_item_id: string;
  is_exercised: boolean;
  created_at: string;
};

const LicenseManagementWidget = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["licenses", page],
    queryFn: async () => {
      const response = await fetch(
        `/admin/digital-asset-licenses?limit=${limit}&offset=${(page - 1) * limit}`,
      );
      return await response.json();
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async (licenseId: string) => {
      await fetch(`/admin/digital-asset-licenses/${licenseId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["licenses"] });
    },
  });

  const handleRevokeClick = (licenseId: string) => {
    if (window.confirm("이 라이선스를 취소하시겠습니까?")) {
      revokeMutation.mutate(licenseId);
    }
  };

  return (
    <Container className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <Heading level="h2">디지털 자산 라이선스 관리</Heading>
      </div>

      {isLoading ? (
        <Text>라이선스 정보를 불러오는 중...</Text>
      ) : data?.licenses?.length > 0 ? (
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
              {data.licenses.map((license: License) => (
                <Table.Row key={license.id}>
                  <Table.Cell>{license.id}</Table.Cell>
                  <Table.Cell>{license.digital_asset_id}</Table.Cell>
                  <Table.Cell>{license.customer_id}</Table.Cell>
                  <Table.Cell>{license.order_item_id}</Table.Cell>
                  <Table.Cell>
                    {license.is_exercised ? (
                      <Badge color="green">사용됨</Badge>
                    ) : (
                      <Badge color="blue">미사용</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>{new Date(license.created_at).toLocaleDateString()}</Table.Cell>
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

          <div className="flex justify-between mt-4">
            <Button
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              이전
            </Button>
            <Text>페이지 {page}</Text>
            <Button
              variant="secondary"
              disabled={!data.licenses || data.licenses.length < limit}
              onClick={() => setPage((p) => p + 1)}
            >
              다음
            </Button>
          </div>
        </>
      ) : (
        <Text className="text-gray-500">사용 가능한 라이선스가 없습니다.</Text>
      )}
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.list.after",
});

export default LicenseManagementWidget;
