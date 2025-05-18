import { Table } from "@medusajs/ui";

export const LicenseTableSkeleton = () => {
  return (
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
          {Array.from({ length: 10 }).map((_, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <div className="h-4 w-20 bg-gray-100 animate-pulse rounded"></div>
              </Table.Cell>
              <Table.Cell>
                <div className="h-4 w-28 bg-gray-100 animate-pulse rounded"></div>
              </Table.Cell>
              <Table.Cell>
                <div className="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
              </Table.Cell>
              <Table.Cell>
                <div className="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
              </Table.Cell>
              <Table.Cell>
                <div className="h-5 w-16 bg-gray-100 animate-pulse rounded-full"></div>
              </Table.Cell>
              <Table.Cell>
                <div className="h-4 w-20 bg-gray-100 animate-pulse rounded"></div>
              </Table.Cell>
              <Table.Cell>
                <div className="h-7 w-14 bg-gray-100 animate-pulse rounded-md"></div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
