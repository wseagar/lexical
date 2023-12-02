import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { StartNewChat } from "@/features/chat/chat-ui/chat-empty-state/start-new-chat";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <Card className="h-full items-center flex justify-center flex-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Group</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableHead>Danilo Sousa</TableHead>
            <TableCell>danilo@example.com</TableCell>
            <TableCell>Developer</TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Zahra Ambessa</TableHead>
            <TableCell>zahra@example.com</TableCell>
            <TableCell>Admin</TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Jasper Eriksson</TableHead>
            <TableCell>jasper@example.com</TableCell>
            <TableCell>Developer</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}
