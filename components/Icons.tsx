// https://rnr-docs.vercel.app/getting-started/initial-setup/
import {
  AlertCircle,
  CheckCircle,
  UserRound,
  LucideIcon,
  XCircle,
  RefreshCw,
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

interopIcon(AlertCircle);
interopIcon(CheckCircle);
interopIcon(UserRound);
interopIcon(XCircle);
interopIcon(RefreshCw);
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
  AlertCircle,
  CheckCircle,
  UserRound,
  XCircle,
  RefreshCw,
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