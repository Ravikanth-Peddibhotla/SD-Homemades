import { ClerkLoading, ClerkProvider, SignIn, SignUp, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, type ReactNode } from 'react';
import { Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { AccountContent } from '@/components/Storefront';
import { StoreProvider } from '@/lib/store';
import { CartPage, CheckoutPage, DiscoverPage, HomePage, ProductPage } from '@/pages/StorefrontPages';
import { AdminDashboardPage, AdminLoginPage } from '@/pages/AdminPages';
import NotFound from '@/pages/not-found';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: { logoPlacement: 'inside' as const, logoLinkUrl: basePath || '/', logoImageUrl: `${window.location.origin}${basePath}/logo.svg`, socialButtonsPlacement: 'top' as const, socialButtonsVariant: 'blockButton' as const },
  variables: { colorPrimary: '#6d2925', colorForeground: '#351b17', colorMutedForeground: '#806b5b', colorDanger: '#a9472f', colorBackground: '#fffaf2', colorInput: '#fffaf2', colorInputForeground: '#351b17', colorNeutral: '#d8c5ae', fontFamily: 'DM Sans, sans-serif', borderRadius: '1rem' },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#fffaf2] rounded-[26px] w-[440px] max-w-full overflow-hidden',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#351b17] font-semibold',
    headerSubtitle: 'text-[#806b5b]',
    socialButtonsBlockButtonText: 'text-[#351b17] font-semibold',
    formFieldLabel: 'text-[#351b17] font-semibold',
    footerActionLink: 'text-[#a9472f] font-semibold',
    footerActionText: 'text-[#806b5b]',
    dividerText: 'text-[#806b5b]',
    identityPreviewEditButton: 'text-[#a9472f]',
    formFieldSuccessText: 'text-[#65804f]',
    alertText: 'text-[#a9472f]',
    logoBox: 'rounded-xl overflow-hidden',
    logoImage: 'rounded-xl',
    socialButtonsBlockButton: 'border-[#dfcebb] bg-[#fffaf2] hover:bg-[#f5eee3]',
    formButtonPrimary: 'bg-[#6d2925] hover:bg-[#351b17] text-[#fff8ed]',
    formFieldInput: 'border-[#d8c5ae] bg-[#fffaf2] text-[#351b17]',
    footerAction: 'bg-transparent',
    dividerLine: 'bg-[#e7d8c5]',
    alert: 'border-[#dcb08b] bg-[#f5dbc9]',
    otpCodeFieldInput: 'border-[#d8c5ae] bg-[#fffaf2] text-[#351b17]',
    formFieldRow: 'text-[#351b17]',
    main: 'bg-[#fffaf2]',
  },
};

function stripBase(path: string) {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path;
}

function SignInPage() {
  return <div className="podis-pickles flex min-h-[100dvh] items-center justify-center bg-[#f5eee3] px-4 py-10"><SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} /></div>;
}

function SignUpPage() {
  return <div className="podis-pickles flex min-h-[100dvh] items-center justify-center bg-[#f5eee3] px-4 py-10"><SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} /></div>;
}

function ClerkCacheInvalidator() {
  const { addListener } = useClerk();
  const client = useQueryClient();
  const previousUser = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const nextUser = user?.id ?? null;
      if (previousUser.current !== undefined && previousUser.current !== nextUser) client.clear();
      previousUser.current = nextUser;
    });
    return unsubscribe;
  }, [addListener, client]);
  return null;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function ClerkRoutes() {
  return <RoutedErrorBoundary><Switch>
    <Route path="/" component={HomePage} />
    <Route path="/discover" component={DiscoverPage} />
    <Route path="/product/:id" component={ProductPage} />
    <Route path="/cart" component={CartPage} />
    <Route path="/checkout" component={CheckoutPage} />
    <Route path="/account" component={AccountContent} />
    <Route path="/sign-in/*?" component={SignInPage} />
    <Route path="/sign-up/*?" component={SignUpPage} />
    <Route component={NotFound} />
  </Switch></RoutedErrorBoundary>;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  return <ClerkProvider publishableKey={clerkPubKey} proxyUrl={clerkProxyUrl} appearance={clerkAppearance} signInUrl={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} routerPush={(to) => setLocation(stripBase(to))} routerReplace={(to) => setLocation(stripBase(to), { replace: true })}><StoreProvider><ClerkLoading><div className="min-h-[100dvh] bg-[#f5eee3]" /></ClerkLoading><ClerkCacheInvalidator /><ClerkRoutes /></StoreProvider></ClerkProvider>;
}

function AdminRoutes() {
  return <Switch><Route path="/admin/login" component={AdminLoginPage} /><Route path="/admin" component={AdminDashboardPage} /></Switch>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={basePath}><Switch><Route path="/admin/*?" component={AdminRoutes} /><Route>{clerkPubKey ? <ClerkProviderWithRoutes /> : <div className="podis-pickles grid min-h-[100dvh] place-items-center bg-[#f5eee3] p-6 text-center"><div><h1 className="pp-display text-3xl font-semibold">The pantry is warming up.</h1><p className="mt-2 text-sm text-[#806b5b]">Authentication configuration is missing.</p></div></div>}</Route></Switch></WouterRouter></TooltipProvider><Toaster /></QueryClientProvider>;
}

export default App;