"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  priceMonthly: number;
  priceYearly: number;
  users: string;
  features: PlanFeature[];
  recommended?: boolean;
}

export interface PricingModuleProps {
  title?: string;
  subtitle?: string;
  annualBillingLabel?: string;
  buttonLabel?: string;
  plans: PricingPlan[];
  defaultAnnual?: boolean;
  className?: string;
}

export function PricingModule({
  title = "Pricing Plans",
  subtitle = "Choose a plan that fits your needs.",
  annualBillingLabel = "Annual billing",
  buttonLabel = "Get started",
  plans,
  defaultAnnual = false,
  className,
}: PricingModuleProps) {
  const [isAnnual, setIsAnnual] = React.useState(defaultAnnual);

  return (
    <section
      className={cn(
        "w-full bg-white text-gray-900 py-20 px-4 md:px-8",
        className
      )}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">{title}</h2>
        <p className="text-gray-500 text-xl mb-8">{subtitle}</p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <Switch
            id="billing-toggle"
            isSelected={isAnnual}
            onChange={(checked) => setIsAnnual(checked)}
          />
          <label
            htmlFor="billing-toggle"
            className="text-sm text-gray-500 cursor-pointer"
          >
            {annualBillingLabel}
          </label>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "relative border rounded-2xl transition-all hover:shadow-lg",
                plan.recommended
                  ? "border-indigo-600 ring-2 ring-indigo-600/30 scale-[1.02]"
                  : "border-gray-200"
              )}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit bg-indigo-600 text-white text-xs font-medium px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <CardHeader className="text-center pt-8">
                <div className="flex justify-center mb-4">{plan.icon}</div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-gray-500">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="text-center">
                <div className="text-4xl font-extrabold mb-1 transition-all duration-300 text-gray-900">
                  £{(isAnnual ? plan.priceYearly : plan.priceMonthly).toFixed(2)}
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  / {isAnnual ? "year" : "month"}
                </p>

                <Button
                  variant={plan.recommended ? "default" : "outline"}
                  className="w-full mb-6 h-12 text-base rounded-xl"
                >
                  {buttonLabel}
                </Button>

                <div className="text-left text-sm">
                  <h4 className="font-semibold mb-2 text-gray-900">Overview</h4>
                  <p className="text-gray-500 mb-4">✓ {plan.users}</p>

                  <h4 className="font-semibold mb-2 text-gray-900">What&apos;s included</h4>
                  <ul className="space-y-2">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {f.included ? (
                          <Check className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <X className="w-4 h-4 text-gray-300" />
                        )}
                        <span
                          className={f.included
                            ? "text-gray-600"
                            : "text-gray-400 line-through"}
                        >
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
