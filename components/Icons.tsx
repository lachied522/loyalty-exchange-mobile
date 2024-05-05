// https://rnr-docs.vercel.app/getting-started/initial-setup/
import {
  icons,
  AlertCircle,
  CheckCircle,
  UserRound,
  LucideIcon,
  XCircle,
  RefreshCw,
  Loader,
  X,
  Info,
  ArrowRightLeft,
  ArrowBigRightDash,
  ChevronLeft,
  Check,
  Plus,
  Pencil,
  ExternalLink,
  LogOut
} from 'lucide-react-native';
import { cssInterop } from 'nativewind';

function interopIcon(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}

const Icon = ({
  name,
  color = 'black',
  size = 24
} : {
  name: keyof typeof icons,
  color?: string,
  size?: number
}) => {
  const LucideIcon = icons[name];

  interopIcon(LucideIcon);

  return <LucideIcon color={color} size={size} />;
};

interopIcon(AlertCircle);
interopIcon(CheckCircle);
interopIcon(UserRound);
interopIcon(XCircle);
interopIcon(RefreshCw);
interopIcon(Loader);
interopIcon(Info);
interopIcon(ArrowRightLeft);
interopIcon(ArrowBigRightDash);
interopIcon(ChevronLeft);
interopIcon(Check);
interopIcon(Plus);
interopIcon(Pencil);
interopIcon(ExternalLink);
interopIcon(LogOut);

export {
  Icon,
  AlertCircle,
  CheckCircle,
  UserRound,
  XCircle,
  RefreshCw,
  Loader,
  X,
  Info,
  ArrowRightLeft,
  ArrowBigRightDash,
  ChevronLeft,
  Check,
  Plus,
  Pencil,
  ExternalLink,
  LogOut
};