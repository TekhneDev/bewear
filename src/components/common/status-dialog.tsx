"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

interface StatusDialogProps {
  title: string;
  description: string;
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
}

const StatusDialog = ({
  title,
  description,
  primaryAction,
  secondaryAction,
}: StatusDialogProps) => {
  return (
    <Dialog open>
      <DialogContent className="text-center" showCloseButton={false}>
        <Image
          src="/illustration.svg"
          alt={title}
          width={300}
          height={300}
          className="mx-auto"
        />
        <DialogTitle className="mt-4 text-2xl">{title}</DialogTitle>
        <DialogDescription className="font-medium">
          {description}
        </DialogDescription>
        <DialogFooter>
          <Button className="rounded-full" size="lg" asChild>
            <Link href={primaryAction.href}>{primaryAction.label}</Link>
          </Button>
          <Button className="rounded-full" variant="outline" size="lg" asChild>
            <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusDialog;
