import { useForm } from "react-hook-form";
import { Fragment } from "react";
import { renderFormField } from "./built/form/generator";
import { useLoginHandler } from "@/api/auth/auth";
import AppNotifications from "./built/app-notifications";
import CustomButton from "./built/button/custom-button";
import { clientSetCookie } from "@/api/api-utils";
import { PUI_TOKEN } from "@/api/constants";
import { useRouter } from "next/navigation";
import { Terminal, Lock, User, ArrowRight, Fingerprint } from "lucide-react";
import { Button } from "./ui/button";

const FORM_FIELDS = [
  {
    type: "email",
    name: "email",
    label: "Neural ID",
    placeholder: "admin@positiveswitch.com",
    required: true,
  },
  {
    type: "password",
    name: "password",
    label: "Access Key",
    placeholder: "Enter your secure access key",
    required: true,
  },
];

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isPending, isSuccess, error, run } = useLoginHandler();
  const router = useRouter();

  const handleLogin = (data: any) => {
    run(
      { user: data },
      {
        onSuccess: (data) => {
          const { token, success } = data;
          if (success) {
            clientSetCookie(PUI_TOKEN, token);
            localStorage.setItem(PUI_TOKEN, token);
            router.push("/sa/dashboard");
          }
        },
      }
    );
  };

  return (
    <div className="p-8 md:p-12 bg-black/40 backdrop-blur-xl relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-l-lg" />
      
      <form onSubmit={handleSubmit(handleLogin)} className="relative z-10">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <Terminal className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                NEURAL ACCESS
              </h1>
              <p className="text-cyan-300 font-semibold tracking-wider uppercase text-sm">
                Authentication Required
              </p>
              <p className="text-gray-400 text-sm">
                Access the Digital Onboarding System
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {FORM_FIELDS.map((field, index) => {
              const Icon = field.name === "email" ? User : Lock;
              return (
                <div key={index} className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-cyan-300 uppercase tracking-wider">
                    <Icon className="w-4 h-4" />
                    {field.label}
                    {field.required && <span className="text-red-400">*</span>}
                  </label>
                  {renderFormField({
                    ...field,
                    className: "bg-black/50 border-gray-600 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-gray-500"
                  }, control, errors)}
                </div>
              );
            })}
          </div>

          {/* Login Button */}
          <div className="space-y-4">
            <Button
              type="submit"
              disabled={isPending}
              className="group w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-600 text-white font-black text-lg py-4 rounded-xl shadow-2xl shadow-cyan-500/50 transition-all duration-500 transform hover:scale-105 border border-cyan-400/50 relative overflow-hidden"
            >
              {isPending ? (
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 animate-spin" />
                  AUTHENTICATING...
                </div>
              ) : (
                <>
                  <span className="flex items-center gap-3">
                    <Fingerprint className="w-5 h-5" />
                    INITIATE ACCESS
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </>
              )}
            </Button>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold">256-BIT ENCRYPTED</span>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <AppNotifications.Error message={error?.message} />
            <AppNotifications.Success
              message={
                isSuccess
                  ? "Neural link established. Redirecting to command center..."
                  : ""
              }
            />
          </div>

          {/* Register Link */}
          <div className="text-center">
            <div className="text-sm text-gray-400">
              Need system access?{" "}
              <a 
                href="/auth/register" 
                className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 transition-colors"
              >
                Request Authorization
              </a>
            </div>
          </div>

          {/* System Status */}
          <div className="border-t border-gray-700 pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-cyan-400 font-black text-sm">ONLINE</div>
                <div className="text-gray-500 text-xs">Status</div>
              </div>
              <div className="space-y-1">
                <div className="text-emerald-400 font-black text-sm">SECURE</div>
                <div className="text-gray-500 text-xs">Protocol</div>
              </div>
              <div className="space-y-1">
                <div className="text-purple-400 font-black text-sm">READY</div>
                <div className="text-gray-500 text-xs">System</div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
