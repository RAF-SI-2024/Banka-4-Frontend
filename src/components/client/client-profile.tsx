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
import { Loader2 } from 'lucide-react';

export default function ClientProfile() {
  const me = useMe();

  if (me.state === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-12 h-12 text-gray-600 dark:text-gray-300 animate-spin" />
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Loading profile...
          </p>
        </div>
      </div>
    );
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
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800">
      {/* added the blur effect here*/}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />

      <Card className="w-[700px] shadow-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-lg bg-white/80 dark:bg-black/50 rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
            My Profile
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Your personal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                First Name
              </Label>
              <Input
                value={client.firstName}
                disabled
                className="bg-gray-100 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Last Name */}
            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                Last Name
              </Label>
              <Input
                value={client.lastName}
                disabled
                className="bg-gray-100 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                Date of Birth
              </Label>
              <Input
                value={new Date(client.dateOfBirth).toLocaleDateString()}
                disabled
                className="bg-gray-100 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Email */}
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Email</Label>
              <Input
                value={client.email}
                disabled
                className="bg-gray-100 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Phone Number */}
            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                Phone Number
              </Label>
              <Input
                value={client.phone}
                disabled
                className="bg-gray-100 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Address */}
            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                Address
              </Label>
              <Input
                value={client.address}
                disabled
                className="bg-gray-100 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Gender */}
            <div className="col-span-2">
              <Label className="text-gray-700 dark:text-gray-300">Gender</Label>
              <Input
                value={client.gender}
                disabled
                className="bg-gray-100 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
