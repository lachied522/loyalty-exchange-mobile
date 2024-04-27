// https://rnr-docs.vercel.app/getting-started/initial-setup/
import { AlertCircle, CheckCircle, LucideIcon, XCircle, RefreshCw, X, Info, ArrowRightLeft, ArrowBigRightDash, ChevronLeft } from 'lucide-react-native';
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
interopIcon(Info);
interopIcon(ArrowRightLeft);
interopIcon(ArrowBigRightDash);
interopIcon(ChevronLeft);

export { AlertCircle, CheckCircle, XCircle, RefreshCw, X, Info, ArrowRightLeft, ArrowBigRightDash, ChevronLeft };