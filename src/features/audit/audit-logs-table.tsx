import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import database from "@/features/common/database";

import { MessageAudit } from "@prisma/client";
const OPENAI_PROMPT_COST = 0.001 / 1000;
const OPENAI_RESPONSE_COST = 0.002 / 1000;

const MessageRows = ({ messageAudits }: { messageAudits: MessageAudit[] }) => {
  return messageAudits.map((message, index) => {
    // Calculate cost
    const cost =
      message.promptTokens * OPENAI_PROMPT_COST +
      message.responseTokens * OPENAI_RESPONSE_COST;

    return (
      <TableRow key={index}>
        <TableCell>{message.createdAt.toLocaleDateString()}</TableCell>
        <TableCell>{message.promptMessage}</TableCell>
        <TableCell>{message.responseMessage}</TableCell>
        <TableCell>{message.model}</TableCell>
        <TableCell>{message.promptTokens}</TableCell>
        <TableCell>{message.responseTokens}</TableCell>
        <TableCell>{`$${cost.toFixed(6)}`}</TableCell>
      </TableRow>
    );
  });
};

const AuditLogsTable = async () => {
  const messageAudits =
    (await database.messageAudit.findMany()) as MessageAudit[];

  if (!messageAudits) return <></>; // TODO: replace this

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Created At</TableHead>
          <TableHead>Prompt</TableHead>
          <TableHead>Response</TableHead>
          <TableHead>Model</TableHead>
          <TableHead>Prompt Tokens</TableHead>
          <TableHead>Response Tokens</TableHead>
          <TableHead>Total Tokens</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <MessageRows messageAudits={messageAudits} />
      </TableBody>
    </Table>
  );
};

export default AuditLogsTable;
