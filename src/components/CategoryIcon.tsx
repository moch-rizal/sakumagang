import React from 'react';
import {
  Utensils,
  Bus,
  Gift,
  BookOpen,
  Home,
  Coffee,
  ShoppingBag,
  Briefcase,
  Film,
  Pill,
  Zap,
  Gamepad2,
  Headphones,
  Plane,
  ShoppingCart,
  Bike,
  Fuel,
  Sparkles,
  Laptop,
  Tag,
  Receipt,
  Heart,
  Shirt,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  'utensils': Utensils,
  'food': Utensils,
  'bus': Bus,
  'transport': Bus,
  'gift': Gift,
  'book-open': BookOpen,
  'book': BookOpen,
  'home': Home,
  'coffee': Coffee,
  'shopping-bag': ShoppingBag,
  'briefcase': Briefcase,
  'work': Briefcase,
  'film': Film,
  'entertainment': Film,
  'pill': Pill,
  'health': Pill,
  'zap': Zap,
  'bills': Zap,
  'gamepad-2': Gamepad2,
  'headphones': Headphones,
  'plane': Plane,
  'shopping-cart': ShoppingCart,
  'cart': ShoppingCart,
  'bike': Bike,
  'fuel': Fuel,
  'gas': Fuel,
  'sparkles': Sparkles,
  'laptop': Laptop,
  'tech': Laptop,
  'tag': Tag,
  'receipt': Receipt,
  'heart': Heart,
  'shirt': Shirt,
};

/**
 * Backward compatibility: maps legacy emojis to clean Lucide icon keys
 */
export const EMOJI_TO_ICON_NAME: Record<string, string> = {
  '🍜': 'utensils',
  '🚌': 'bus',
  '🍫': 'gift',
  '📚': 'book-open',
  '🏠': 'home',
  '☕': 'coffee',
  '🛍️': 'shopping-bag',
  '💼': 'briefcase',
  '🍿': 'film',
  '💊': 'pill',
  '💡': 'zap',
  '🎮': 'gamepad-2',
  '🎧': 'headphones',
  '✈️': 'plane',
  '🎁': 'gift',
  '🛒': 'shopping-cart',
  '🚲': 'bike',
  '⛽': 'fuel',
  '🧼': 'sparkles',
  '💻': 'laptop',
  '🏷️': 'tag',
};

export function resolveIconName(raw: string | undefined): string {
  if (!raw) return 'tag';
  if (EMOJI_TO_ICON_NAME[raw]) return EMOJI_TO_ICON_NAME[raw];
  if (ICON_MAP[raw]) return raw;
  return 'tag';
}

interface CategoryIconProps {
  icon?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  icon = 'tag',
  size = 'md',
  className = '',
}) => {
  const iconKey = resolveIconName(icon);
  const IconComponent = ICON_MAP[iconKey] || HelpCircle;

  const sizeClass = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  }[size];

  return <IconComponent className={`${sizeClass} ${className}`} strokeWidth={1.75} />;
};
