// https://rnr-docs.vercel.app/getting-started/initial-setup/
import { AlertCircle, CheckCircle, LucideIcon, XCircle, RefreshCw, X } from 'lucide-react-native';
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
interopIcon(XCircle);
interopIcon(RefreshCw);

export { AlertCircle, CheckCircle, XCircle, RefreshCw, X };