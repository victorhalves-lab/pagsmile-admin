import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { ChevronRight, Home, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  icon: Icon,
  className
}) {
  return (
    <div className={cn("mb-8", className)}>
      {breadcrumbs.length > 0 && (
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={createPageUrl('Dashboard')} className="text-[#2bc196] hover:text-emerald-600 transition-colors">
                  <Home className="w-4 h-4" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage className="font-semibold text-slate-700 dark:text-slate-200">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link 
                        to={createPageUrl(crumb.page)} 
                        className="text-slate-500 hover:text-[#2bc196] transition-colors font-medium"
                      >
                        {crumb.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2bc196] to-emerald-600 flex items-center justify-center shadow-lg shadow-[#2bc196]/20">
              <Icon className="w-7 h-7 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
              {title}
              {subtitle && <Sparkles className="w-5 h-5 text-[#2bc196]" />}
            </h1>
            {subtitle && (
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-base font-medium">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}