'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMe } from '@/hooks/use-me';

export default function ClientProfile() {
  const me = useMe();

  if (me.state === 'loading') {
    return <p className="text-center text-lg">Loading profile...</p>;
  }

  if (me.state === 'error') {
    return <p className="text-center text-red-500">Failed to load profile.</p>;
  }

  if (me.state !== 'logged-in' || me.type !== 'client') {
    return (
      <p className="text-center text-gray-500">No client profile found.</p>
    );
  }

  const client = me.me;

  return (
    <div className="flex justify-center items-center pt-16">
      <Card className="w-[600px] shadow-lg border">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {/* First Name */}
            <div>
              <Label>First Name</Label>
              <Input value={client.firstName} disabled />
            </div>

            {/* Last Name */}
            <div>
              <Label>Last Name</Label>
              <Input value={client.lastName} disabled />
            </div>

            {/* Date of Birth */}
            <div>
              <Label>Date of Birth</Label>
              <Input
                value={new Date(client.dateOfBirth).toLocaleDateString()}
                disabled
              />
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input value={client.email} disabled />
            </div>

            {/* Phone Number */}
            <div>
              <Label>Phone Number</Label>
              <Input value={client.phone} disabled />
            </div>

            {/* Address */}
            <div>
              <Label>Address</Label>
              <Input value={client.address} disabled />
            </div>

            {/* Gender */}
            <div>
              <Label>Gender</Label>
              <Input value={client.gender} disabled />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
