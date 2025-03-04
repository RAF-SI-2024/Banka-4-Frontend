import { Card,
     CardContent,
    CardHeader,
CardTitle,
CardDescription,
CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function CarouselItem({
    item,
  }: {
    item: {
      accountTitle: string;
      accountNumber: string;
      balance: number;
    }[];
  }) {
  return (
    <div>
      <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
    </div>
  );
}
