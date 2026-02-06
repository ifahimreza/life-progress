import type {ReactNode, SVGProps} from "react";

export type DotSpanIconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  size?: number;
  strokeWidth?: number;
};

function IconBase({
  size = 24,
  strokeWidth = 1.9,
  className = "",
  children,
  ...props
}: DotSpanIconProps & {children: ReactNode}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <path d="m3.5 10.5 8.5-7 8.5 7V20a1 1 0 0 1-1 1H14a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1v-9.5Z" />
    </IconBase>
  );
}

export function DashboardIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13" y="3.5" width="7.5" height="5.2" rx="1.5" />
      <rect x="13" y="10.5" width="7.5" height="10" rx="1.5" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" />
    </IconBase>
  );
}

export function LoginIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <path d="M12.75 4H18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5.25" />
      <path d="m10.5 16 4-4-4-4" />
      <path d="M14.5 12H4" />
    </IconBase>
  );
}

export function ProIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 2.35 4.77 5.27.77-3.82 3.72.9 5.24L12 15.02 7.3 17.5l.9-5.24L4.38 8.54l5.27-.77L12 3Z" />
    </IconBase>
  );
}

export function SettingsIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="m19.4 15.1.85 1.5a1 1 0 0 1-.24 1.28l-1.1 1.1a1 1 0 0 1-1.28.24l-1.5-.85a7.5 7.5 0 0 1-1.8.75L14 21a1 1 0 0 1-.98.75h-2.04A1 1 0 0 1 10 21l-.34-1.87a7.5 7.5 0 0 1-1.8-.75l-1.5.85a1 1 0 0 1-1.28-.24l-1.1-1.1a1 1 0 0 1-.24-1.28l.85-1.5a7.5 7.5 0 0 1 0-2.2l-.85-1.5a1 1 0 0 1 .24-1.28l1.1-1.1a1 1 0 0 1 1.28-.24l1.5.85a7.5 7.5 0 0 1 1.8-.75L10 3a1 1 0 0 1 .98-.75h2.04A1 1 0 0 1 14 3l.34 1.87a7.5 7.5 0 0 1 1.8.75l1.5-.85a1 1 0 0 1 1.28.24l1.1 1.1a1 1 0 0 1 .24 1.28l-.85 1.5a7.5 7.5 0 0 1 0 2.2Z" />
    </IconBase>
  );
}

export function DownloadIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 4.5v9" />
      <path d="m8.5 10 3.5 3.5 3.5-3.5" />
      <path d="M3.75 15.5 4.5 20a1.5 1.5 0 0 0 1.48 1.25h12.04A1.5 1.5 0 0 0 19.5 20l.75-4.5" />
    </IconBase>
  );
}

export function PrintIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 8V4h10v4" />
      <rect x="5" y="12" width="14" height="8" rx="1.8" />
      <path d="M7.5 15h9M7.5 18h6" />
      <path d="M17.5 10.25h.01" />
    </IconBase>
  );
}

export function DocumentIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5Z" />
      <path d="M14 3.5V8h4" />
      <path d="M9 12h6M9 15h6M9 18h4" />
    </IconBase>
  );
}

export function PaletteIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3.25a8.75 8.75 0 0 0 0 17.5h1.1a2.4 2.4 0 0 0 0-4.8h-.6a2 2 0 0 1-2-2 8.7 8.7 0 0 1 8.75-8.7Z" />
      <circle cx="6.8" cy="9.7" r=".7" />
      <circle cx="9.2" cy="7.2" r=".7" />
      <circle cx="12.6" cy="6.4" r=".7" />
      <circle cx="15.7" cy="8" r=".7" />
    </IconBase>
  );
}

export function ShareLinkIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <path d="M10 14a4.5 4.5 0 0 1 0-6.36l1.3-1.3a4.5 4.5 0 1 1 6.36 6.36L16.4 14" />
      <path d="M14 10a4.5 4.5 0 0 1 0 6.36l-1.3 1.3a4.5 4.5 0 0 1-6.36-6.36L7.6 10" />
    </IconBase>
  );
}

export function ReminderIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12.3" r="8.5" />
      <path d="M12 7.7v4.8l3 1.8" />
      <path d="M6.7 3.8 5.1 5.4M17.3 3.8l1.6 1.6" />
    </IconBase>
  );
}

export function GlobeIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.2 2.5 3.4 5.7 3.4 9s-1.2 6.5-3.4 9M12 3c-2.2 2.5-3.4 5.7-3.4 9s1.2 6.5 3.4 9" />
    </IconBase>
  );
}

export function ChevronDownIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  );
}

export function ArrowLeftIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <path d="m10 6-6 6 6 6" />
      <path d="M4 12h16" />
    </IconBase>
  );
}

export function CloseIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </IconBase>
  );
}

export function PrivacyIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3 5 6v5c0 5 3.1 8.7 7 10 3.9-1.3 7-5 7-10V6l-7-3Z" />
      <rect x="9" y="10.4" width="6" height="4.2" rx="1" />
      <path d="M10 10.4V9a2 2 0 1 1 4 0v1.4" />
    </IconBase>
  );
}

export function TermsIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <rect x="5.2" y="3.4" width="13.6" height="17.2" rx="2" />
      <path d="M8.2 8.2h7.6M8.2 11.5h7.6M8.2 14.8h5.6" />
    </IconBase>
  );
}

export function RefundIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <path d="M3.8 11A8.4 8.4 0 1 0 6 5.2" />
      <path d="M2.8 4.8 6.2 5l-.2 3.4" />
      <path d="M12 8.8v6.4M14.4 10.4c-.2-.9-1-1.6-2.1-1.6-1.2 0-2.1.7-2.1 1.7 0 .9.7 1.4 1.9 1.7l.9.2c1.2.3 1.9.8 1.9 1.8 0 1-.9 1.8-2.2 1.8-1.1 0-2-.6-2.2-1.6" />
    </IconBase>
  );
}

export function ContactIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7 7.5 5.5L19.5 7" />
    </IconBase>
  );
}

export function AdminIcon(props: DotSpanIconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3.5 5.5 6v4.3c0 4.2 2.6 7.7 6.5 9 3.9-1.3 6.5-4.8 6.5-9V6L12 3.5Z" />
      <path d="M9.2 12.2 11 14l3.8-3.8" />
    </IconBase>
  );
}

export const DOTSPAN_ICON_SET = {
  home: HomeIcon,
  dashboard: DashboardIcon,
  login: LoginIcon,
  pro: ProIcon,
  settings: SettingsIcon,
  download: DownloadIcon,
  print: PrintIcon,
  document: DocumentIcon,
  palette: PaletteIcon,
  share: ShareLinkIcon,
  reminder: ReminderIcon,
  globe: GlobeIcon,
  chevronDown: ChevronDownIcon,
  arrowLeft: ArrowLeftIcon,
  close: CloseIcon,
  privacy: PrivacyIcon,
  terms: TermsIcon,
  refund: RefundIcon,
  contact: ContactIcon,
  admin: AdminIcon
};

export type DotSpanIconName = keyof typeof DOTSPAN_ICON_SET;
