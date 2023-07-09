import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import {
  ArrowLeft,
  Menu,
  List,
  Download,
  FileText,
  Trello,
  Trash,
  Users,
  Sidebar,
  Clipboard,
  Monitor,
  Plus,
  Zap,
  Heart,
  LogOut,
  User,
  X,
  LogIn,
  Search,
  Home,
  UserCheck,
  CheckSquare,
  Move,
  Edit,
  XCircle,
  Calendar,
  Check,
  Slash,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Minus,
} from 'angular-feather/icons';

const icons = {
  ArrowLeft,
  Menu,
  List,
  Download,
  FileText,
  Trello,
  Trash,
  Users,
  Sidebar,
  Clipboard,
  Monitor,
  Plus,
  Zap,
  Heart,
  LogOut,
  User,
  X,
  LogIn,
  Search,
  Slash,
  Home,
  UserCheck,
  CheckSquare,
  Move,
  Edit,
  XCircle,
  Check,
  Calendar,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Minus,
};

@NgModule({
  declarations: [],
  imports: [FeatherModule.pick(icons)],
  exports: [FeatherModule],
})
export class FeatherIconsModule {}