"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export const LogIn = () => {
  return (
    <Card className="flex gap-2 flex-col min-w-[300px]">
      <CardHeader className="gap-2">
        <CardTitle className="text-2xl flex gap-2">
          <img src="/ai-icon.png" className="w-24 mx-auto" />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button onClick={() => signIn("github")}>Google</Button>
        <Button onClick={() => signIn("azure-ad")}> Microsoft 365</Button>
        <Button onClick={() => signIn("localdev")}>Local</Button>
      </CardContent>
    </Card>
  );
};
