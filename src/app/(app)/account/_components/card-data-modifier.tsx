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
  header,
}: {
  title?: string;
  description?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
}) {
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        {header ? (
          header
        ) : (
          <>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </>
        )}
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
