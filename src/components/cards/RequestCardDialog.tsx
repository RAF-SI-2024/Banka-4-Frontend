import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthorizedUserDto } from '@/api/request/authorized-user';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';

export type RequestCardDialogProps = {
  open: boolean;
  onConfirm: (authorizedUser?: AuthorizedUserDto) => void;
  onCancel?: () => void;
  title: string;
  description: string;
  accountType: string;
};

export const RequestCardDialog = ({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  accountType,
}: RequestCardDialogProps) => {
  const [authorizedUser, setAuthorizedUser] = useState<
    Partial<AuthorizedUserDto>
  >({});
  const [requestForSelf, setRequestForSelf] = useState(true);

  const handleConfirm = () => {
    const user =
      accountType === 'CheckingBusiness' && !requestForSelf
        ? authorizedUser
        : undefined;
    onConfirm(user as AuthorizedUserDto);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          {accountType === 'CheckingBusiness' && (
            <div className="space-y-2">
              <div className="flex space-x-4">
                <Button
                  onClick={() => setRequestForSelf(true)}
                  className={requestForSelf ? 'bg-blue-500' : ''}
                >
                  Request for Self
                </Button>
                <Button
                  onClick={() => setRequestForSelf(false)}
                  className={!requestForSelf ? 'bg-blue-500' : ''}
                >
                  Request for Authorized User
                </Button>
              </div>
              {!requestForSelf && (
                <div className="space-y-4">
                  <h3>Authorized User Details</h3>
                  <Input
                    placeholder="First Name"
                    value={authorizedUser.firstName || ''}
                    onChange={(e) =>
                      setAuthorizedUser({
                        ...authorizedUser,
                        firstName: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Last Name"
                    value={authorizedUser.lastName || ''}
                    onChange={(e) =>
                      setAuthorizedUser({
                        ...authorizedUser,
                        lastName: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Date of Birth"
                    value={authorizedUser.dateOfBirth || ''}
                    onChange={(e) =>
                      setAuthorizedUser({
                        ...authorizedUser,
                        dateOfBirth: e.target.value,
                      })
                    }
                  />
                  <Select
                    value={authorizedUser.gender || ''}
                    onValueChange={(value) =>
                      setAuthorizedUser({
                        ...authorizedUser,
                        gender: value as 'MALE' | 'FEMALE',
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <Label>Select Gender</Label>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Email"
                    value={authorizedUser.email || ''}
                    onChange={(e) =>
                      setAuthorizedUser({
                        ...authorizedUser,
                        email: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Phone Number"
                    value={authorizedUser.phoneNumber || ''}
                    onChange={(e) =>
                      setAuthorizedUser({
                        ...authorizedUser,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Address"
                    value={authorizedUser.address || ''}
                    onChange={(e) =>
                      setAuthorizedUser({
                        ...authorizedUser,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleConfirm} variant="destructive">
              Confirm
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
