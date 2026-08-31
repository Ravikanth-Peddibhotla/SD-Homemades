import { useEffect, useState, type ComponentType } from "react";
import { ClerkProvider, ClerkLoading, Show, SignInButton, SignUpButton } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";

import { modules as discoveredModules } from "./.generated/mockup-components";

type ModuleMap = Record<string, () => Promise<Record<string, unknown>>>;

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in the environment.");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "#6d2925",
    colorForeground: "#351b17",
    colorMutedForeground: "#806b5b",
    colorDanger: "#a9472f",
    colorBackground: "#fffaf2",
    colorInput: "#fffaf2",
    colorInputForeground: "#351b17",
    colorNeutral: "#d8c5ae",
    fontFamily: "DM Sans, sans-serif",
    borderRadius: "1rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#fffaf2] rounded-[26px] w-[380px] max-w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-[#351b17] font-semibold",
    headerSubtitle: "text-[#806b5b]",
    socialButtonsBlockButtonText: "text-[#351b17] font-semibold",
    formFieldLabel: "text-[#351b17] font-semibold",
    footerActionLink: "text-[#a9472f] font-semibold",
    footerActionText: "text-[#806b5b]",
    dividerText: "text-[#806b5b]",
    identityPreviewEditButton: "text-[#a9472f]",
    formFieldSuccessText: "text-[#65804f]",
    alertText: "text-[#a9472f]",
    logoBox: "rounded-xl overflow-hidden",
    logoImage: "rounded-xl",
    socialButtonsBlockButton: "border-[#dfcebb] bg-[#fffaf2] hover:bg-[#f5eee3]",
    formButtonPrimary: "bg-[#6d2925] hover:bg-[#351b17] text-[#fff8ed]",
    formFieldInput: "border-[#d8c5ae] bg-[#fffaf2] text-[#351b17]",
    footerAction: "bg-transparent",
    dividerLine: "bg-[#e7d8c5]",
    alert: "border-[#dcb08b] bg-[#f5dbc9]",
    otpCodeFieldInput: "border-[#d8c5ae] bg-[#fffaf2] text-[#351b17]",
    formFieldRow: "text-[#351b17]",
    main: "bg-[#fffaf2]",
  },
};

function _resolveComponent(
  mod: Record<string, unknown>,
  name: string,
): ComponentType | undefined {
  const fns = Object.values(mod).filter(
    (v) => typeof v === "function",
  ) as ComponentType[];
  return (
    (mod.default as ComponentType) ||
    (mod.Preview as ComponentType) ||
    (mod[name] as ComponentType) ||
    fns[fns.length - 1]
  );
}

function PreviewRenderer({
  componentPath,
  modules,
}: {
  componentPath: string;
  modules: ModuleMap;
}) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setComponent(null);
    setError(null);

    async function loadComponent(): Promise<void> {
      const key = `./components/mockups/${componentPath}.tsx`;
      const loader = modules[key];
      if (!loader) {
        setError(`No component found at ${componentPath}.tsx`);
        return;
      }

      try {
        const mod = await loader();
        if (cancelled) {
          return;
        }
        const name = componentPath.split("/").pop()!;
        const comp = _resolveComponent(mod, name);
        if (!comp) {
          setError(
            `No exported React component found in ${componentPath}.tsx\n\nMake sure the file has at least one exported function component.`,
          );
          return;
        }
        setComponent(() => comp);
      } catch (e) {
        if (cancelled) {
          return;
        }

        const message = e instanceof Error ? e.message : String(e);
        setError(`Failed to load preview.\n${message}`);
      }
    }

    void loadComponent();

    return () => {
      cancelled = true;
    };
  }, [componentPath, modules]);

  if (error) {
    return (
      <pre style={{ color: "red", padding: "2rem", fontFamily: "system-ui" }}>
        {error}
      </pre>
    );
  }

  if (!Component) return null;

  return <Component />;
}

function getBasePath(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, "");
}

function getPreviewExamplePath(): string {
  const basePath = getBasePath();
  return `${basePath}/preview/ComponentName`;
}

function Gallery() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Component Preview Server
        </h1>
        <p className="text-gray-500 mb-4">
          This server renders individual components for the workspace canvas.
        </p>
        <p className="text-sm text-gray-400">
          Access component previews at{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
            {getPreviewExamplePath()}
          </code>
        </p>
      </div>
    </div>
  );
}

function getPreviewPath(): string | null {
  const currentBasePath = getBasePath();
  const { pathname } = window.location;
  const local =
    currentBasePath && pathname.startsWith(currentBasePath)
      ? pathname.slice(currentBasePath.length) || "/"
      : pathname;
  const match = local.match(/^\/preview\/(.+)$/);
  return match ? match[1] : null;
}

function AuthRequired() {
  return (
    <div className="podis-pickles flex min-h-[100dvh] items-center justify-center bg-[#6d2925] px-6 py-10 text-[#fff8ed]">
      <div className="w-full max-w-[360px] rounded-[28px] border border-[#f0c47a]/30 bg-[#fff8ed]/10 p-7 text-center backdrop-blur">
        <img src={`${basePath}/logo.svg`} alt="Homemade Podis & Pickles" className="mx-auto h-16 w-16 rounded-2xl" />
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[.24em] text-[#eec37d]">A little jar of home</p>
        <h1 className="pp-display mt-3 text-[34px] font-semibold leading-none">Sign in to shop the pantry.</h1>
        <p className="mt-4 text-[14px] leading-6 text-[#f7dfc2]/75">Your bag, saved favourites, and delivery details stay with you.</p>
        <SignInButton mode="modal">
          <button type="button" className="mt-7 w-full rounded-2xl bg-[#fff8ed] px-5 py-4 text-[13px] font-bold text-[#6d2925] transition-transform active:scale-[.98]">Sign in securely</button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button type="button" className="mt-3 w-full rounded-2xl border border-[#f0c47a]/50 px-5 py-4 text-[13px] font-bold text-[#fff8ed] transition-transform active:scale-[.98]">Create an account</button>
        </SignUpButton>
        <p className="mt-5 text-[10px] text-[#f7dfc2]/55">Secure authentication powered by Clerk</p>
      </div>
    </div>
  );
}

function App() {
  const previewPath = getPreviewPath();

  if (previewPath) {
    return (
      <ClerkProvider
        publishableKey={clerkPubKey}
        proxyUrl={clerkProxyUrl}
        appearance={clerkAppearance}
        signInFallbackRedirectUrl={`${basePath}/preview/podis-pickles/Home`}
        signUpFallbackRedirectUrl={`${basePath}/preview/podis-pickles/Home`}
      >
        <ClerkLoading>
          <div className="min-h-[100dvh] bg-[#f5eee3]" />
        </ClerkLoading>
        {previewPath.endsWith("/Welcome") ? (
          <PreviewRenderer
            componentPath={previewPath}
            modules={discoveredModules}
          />
        ) : (
          <>
            <Show when="signed-in">
              <PreviewRenderer
                componentPath={previewPath}
                modules={discoveredModules}
              />
            </Show>
            <Show when="signed-out">
              <AuthRequired />
            </Show>
          </>
        )}
      </ClerkProvider>
    );
  }

  return <Gallery />;
}

export default App;
