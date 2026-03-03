import React from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AuthLayout({ title, description, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gray-50 dark:bg-[#0f172a]">
      <Card className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-700 slide-in-from-bottom-8 bg-white dark:bg-[#1E293B] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border-gray-100 dark:border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-center text-gray-500 dark:text-gray-400">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        {children}
      </Card>
    </div>
  );
}
