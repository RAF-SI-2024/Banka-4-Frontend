'use client';
import LoginForm, { LoginFormData } from '@/components/auth/login-form';
import { useAuth } from '@/context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserType } from '@/api/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import LoginBlock from '@/components/LoginBlock';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();

  const { isPending, mutate: doLogin } = useMutation({
    mutationFn: async ({
      email,
      password,
      userType,
    }: LoginFormData & {
      userType: UserType;
    }) => {
      if (!auth.isLoggedIn) await auth.login(userType, email, password);
    },
    onSuccess: () => {
      toast.success('Success!');
    },
  });

  return (
    <LoginBlock>
      <div className="flex justify-center items-center pt-16">
        <Tabs defaultValue={'client'}>
          <TabsList className={'w-full'}>
            <TabsTrigger id="client-tab" className={'w-full'} value="client">
              Client
            </TabsTrigger>
            <TabsTrigger
              id="employee-tab"
              className={'w-full'}
              value="employee"
            >
              Employee
            </TabsTrigger>
          </TabsList>
          <TabsContent value={'client'}>
            <Card className="w-[348px] shadow-md">
              <CardHeader className="space-y-2">
                <CardTitle>Client Login</CardTitle>
                <CardDescription>
                  Securely access your account and manage your finances with
                  ease.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <LoginForm
                  enabled={!isPending}
                  onSubmitAction={(vals) =>
                    doLogin({
                      ...vals,
                      userType: 'client',
                    })
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value={'employee'}>
            <Card className="w-[348px] shadow-md">
              <CardHeader className="space-y-2">
                <CardTitle>Employee Login</CardTitle>
                <CardDescription>
                  Securely access your account and manage your finances with
                  ease.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <LoginForm
                  enabled={!isPending}
                  onSubmitAction={(vals) =>
                    doLogin({
                      ...vals,
                      userType: 'employee',
                    })
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LoginBlock>
  );
}
