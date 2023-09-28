"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CardDataModifier({
  title,
  description,
  content,
  footer,
  className,
}: {
  title?: string;
  description?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {content ? <CardContent>{content}</CardContent> : null}

      {footer ? (
        <>
          <Separator />
          <CardFooter className="mt-4">{footer}</CardFooter>
        </>
      ) : null}
    </Card>
  );
}
