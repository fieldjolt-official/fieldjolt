"use client";

import { GithubIcon, GoogleIcon } from "@fieldjolt/ui/components/brand-icons";
import { Button } from "@fieldjolt/ui/components/button";
import {
  Field,
  FieldError,
  FieldSeparator,
} from "@fieldjolt/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@fieldjolt/ui/components/input-group";
import { toast } from "@fieldjolt/ui/components/sonner";
import { Spinner } from "@fieldjolt/ui/components/spinner";
import { useForm } from "@tanstack/react-form";
import { MailIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { getBaseUrl } from "@/lib/utils";
import { AuthLayoutWrapper } from "./_components/AuthLayoutWrapper";

export default function AuthPage() {
  const router = useRouter();
  const [transition, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        await authClient.signIn.magicLink(
          {
            email: value.email,
            callbackURL: `${getBaseUrl()}/dashboard`,
            errorCallbackURL: `${getBaseUrl()}/auth`,
          },
          {
            onSuccess: () => {
              router.push("/auth/magic");
            },
            onError: (error) => {
              toast.error(error.error.message || error.error.statusText);
            },
          }
        );
      });
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
      }),
    },
  });

  return (
    <AuthLayoutWrapper
      description="Sign in to your FieldJolt account"
      testimonial={{
        quote:
          "FieldJolt transformed how we manage our HVAC business. Scheduling is effortless, and our techs love the mobile app.",
        author: "Mike Johnson",
        role: "Owner",
        company: "Johnson HVAC Services",
      }}
      title="Welcome back"
    >
      <div className="flex w-full flex-col gap-6">
        <div className="space-y-4">
          <Button
            className="w-full"
            disabled={transition}
            onClick={() =>
              startTransition(async () => {
                const result = await authClient.signIn.social({
                  provider: "google",
                  callbackURL: `${getBaseUrl()}/dashboard`,
                  errorCallbackURL: `${getBaseUrl()}/auth`,
                });

                if (result.error) {
                  toast.error(result.error.message || result.error.statusText);
                }
              })
            }
            size="lg"
            variant="outline"
          >
            <GoogleIcon className="size-4" /> Continue with Google
          </Button>
          <Button
            className="w-full"
            disabled={transition}
            onClick={() =>
              startTransition(async () => {
                const result = await authClient.signIn.social({
                  provider: "github",
                  callbackURL: `${getBaseUrl()}/dashboard`,
                  errorCallbackURL: `${getBaseUrl()}/auth`,
                });

                if (result.error) {
                  toast.error(result.error.message || result.error.statusText);
                }
              })
            }
            size="lg"
            variant="outline"
          >
            <GithubIcon className="size-4" /> Continue with Github
          </Button>
        </div>
        <FieldSeparator>or</FieldSeparator>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field name="email">
            {(field) => (
              <Field>
                <InputGroup>
                  <InputGroupAddon>
                    <MailIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="email"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="name@company.com"
                    required
                    type="email"
                    value={field.state.value}
                  />
                </InputGroup>
                {field.state.meta.errors.map((error) => (
                  <FieldError key={error?.message}>{error?.message}</FieldError>
                ))}
              </Field>
            )}
          </form.Field>

          <form.Subscribe>
            {(state) => (
              <Button
                className="w-full"
                disabled={transition || state.isSubmitting || !state.canSubmit}
                size="lg"
                type="submit"
              >
                {state.isSubmitting ? <Spinner /> : "Continue with Email"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <p className="text-center text-muted-foreground text-xs">
          By continuing, you agree to our{" "}
          <Link className="underline hover:text-primary" href="/terms">
            Terms
          </Link>
          and{" "}
          <Link className="underline hover:text-primary" href="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </AuthLayoutWrapper>
  );
}
