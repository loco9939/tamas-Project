import { tw } from '@/utils/tailwindMerge';
import { Icon } from '@/components/Icon';

type InformationListProps<T extends React.ElementType> = {
  subtitle: string;
} & Component<T>;

export function InformationList({
  children,
  className,
  ...restProps
}: InformationListProps<'button'>) {
  return (
    <button
      type="button"
      className={tw(
        'relative flex h-20 w-[390px] flex-col justify-center border-b border-Gray-100 bg-White pl-10 text-Black',
        className
      )}
      {...restProps}
    >
      {children}
    </button>
  );
}

type TitleProps<T extends React.ElementType> = Component<T>;

function Title({ children, className, ...restProps }: TitleProps<'p'>) {
  return (
    <p className={tw('text-body2', className)} {...restProps}>
      {children}
    </p>
  );
}

type DateProps<T extends React.ElementType> = Component<T>;

function Date({ children, className, ...restProps }: DateProps<'p'>) {
  return (
    <p
      className={tw('text-body3 font-bold text-Gray-400', className)}
      {...restProps}
    >
      {children}
    </p>
  );
}

InformationList.Date = Date;
InformationList.Title = Title;
InformationList.Icon = Icon;
