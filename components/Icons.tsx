// https://rnr-docs.vercel.app/getting-started/initial-setup/
import {
  icons,
  type LucideIcon,
  CheckCircle,
  UserRound,
  CircleUserRound,
  RefreshCw,
  Loader,
  X,
  Info,
  Search,
  Clock,
  ChevronLeft,
  Check,
  MapPin,
  Plus,
  Pencil,
  Settings,
  ExternalLink,
  LogOut,
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

interopIcon(CheckCircle);
interopIcon(UserRound);
interopIcon(CircleUserRound);
interopIcon(RefreshCw);
interopIcon(Loader);
interopIcon(X);
interopIcon(Info);
interopIcon(Search);
interopIcon(Clock);
interopIcon(ChevronLeft);
interopIcon(Check);
interopIcon(MapPin);
interopIcon(Plus);
interopIcon(Pencil);
interopIcon(Settings);
interopIcon(ExternalLink);
interopIcon(LogOut);

export {
  Icon,
  CheckCircle,
  UserRound,
  CircleUserRound,
  RefreshCw,
  Loader,
  X,
  Info,
  Search,
  Clock,
  ChevronLeft,
  Check,
  MapPin,
  Plus,
  Pencil,
  Settings,
  ExternalLink,
  LogOut,
};