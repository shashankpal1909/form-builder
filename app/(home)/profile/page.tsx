import React from "react";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type Props = {};

const ProfileComponent = (props: Props) => {
  return (
    <div className="flex flex-grow flex-col gap-2 container my-8">
      <div className="flex flex-col w-full space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <Label className="text-muted-foreground">Manage your profile</Label>
      </div>
      <Separator className="my-6" />
    </div>
  );
};

export default ProfileComponent;
