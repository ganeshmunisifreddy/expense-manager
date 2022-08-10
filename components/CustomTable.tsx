import { useState } from "react";
import { Table, Row, Col, Tooltip } from "@nextui-org/react";
import { TrashIcon, PencilIcon, HomeIcon, UserIcon } from "@heroicons/react/outline";
import { format } from "date-fns";
import { db, auth } from "../firebase/config";
import { doc, deleteDoc } from "firebase/firestore";

const columns = [
  {
    key: "date",
    label: "Date",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "account",
    label: "Account",
  },
  {
    key: "isHomeExpense",
    label: "Home Expense",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

const CustomTable = (props: any) => {
  const [transactions, setTransactions] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>("");

  const handleDelete = async (item: any) => {
    let isConfirm = confirm("Are you sure, you want to delete?");
    if (isConfirm) {
      let docRef = doc(db, "expenses", item.id);
      await deleteDoc(docRef);
    }
  };

  const handleEditMode = (id: string) => {
    setTransactionId(id);
  };

  const renderCell = (item: any, columnKey: any) => {
    switch (columnKey) {
      case "actions":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Tooltip content="Edit Transaction">
                <div onClick={() => handleEditMode(item.id)}>
                  <PencilIcon height={20} color="#0272F5" />
                </div>
              </Tooltip>
            </Col>
            <Col css={{ d: "flex" }}>
              <Tooltip content="Delete user" color="error" onClick={() => handleDelete(item)}>
                <div>
                  <TrashIcon height={20} color="#FF0080" />
                </div>
              </Tooltip>
            </Col>
          </Row>
        );
      case "date":
        return format(new Date(item[columnKey]), "dd-MM-yyyy");
      case "isHomeExpense":
        return item[columnKey] ? <HomeIcon height={20} color="#0272F5" /> : "---";
      default:
        return item[columnKey];
    }
  };

  return (
    <div>
      <Table aria-label="Transaction Table">
        <Table.Header columns={columns}>
          {(column) => <Table.Column key={column.key}>{column.label}</Table.Column>}
        </Table.Header>
        <Table.Body items={[]}>
          {(item: any) => (
            <Table.Row key={item.id}>
              {(columnKey) => <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

export default CustomTable;
