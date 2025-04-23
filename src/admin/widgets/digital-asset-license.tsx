import React, { useEffect, useState } from "react";
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Table } from "@medusajs/ui";

type License = {
    id: string;
    digital_asset_id: string;
    customer_id: string;
    order_item_id: string;
}

const DigitalAssetLicenseWidget = () => {
    const [licenses, setLicenses] = useState<License[]>([])

    useEffect(() => {
        const fetchLicenses = async () => {
            try {
                const response = await fetch("/api/admin/digital-asset-licenses?Limit=10")
                const data = await response.json()
                setLicenses(data.licenses)
            } catch (error) {
                console.error("Error fetching licenses:", error)
            }
        }
        fetchLicenses()
    },[])

    return (
        <Container>
            <Heading>Digital Asset License</Heading>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Digital Asset ID</Table.HeaderCell>
                        <Table.HeaderCell>Customer ID</Table.HeaderCell>
                        <Table.HeaderCell>Order Item ID</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {licenses.map((license) => (
                        <Table.Row key={license.id}>
                            <Table.Cell>{license.id}</Table.Cell>
                            <Table.Cell>{license.digital_asset_id}</Table.Cell>
                            <Table.Cell>{license.customer_id}</Table.Cell>
                            <Table.Cell>{license.order_item_id}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "product.details.before",
})

export default DigitalAssetLicenseWidget